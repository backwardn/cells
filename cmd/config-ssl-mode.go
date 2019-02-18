/*
 * Copyright (c) 2018. Abstrium SAS <team (at) pydio.com>
 * This file is part of Pydio Cells.
 *
 * Pydio Cells is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Pydio Cells is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with Pydio Cells.  If not, see <http://www.gnu.org/licenses/>.
 *
 * The latest code can be found at <https://pydio.com>.
 */

package cmd

import (
	"fmt"
	"log"
	"net/url"

	"github.com/spf13/cobra"

	"github.com/manifoldco/promptui"
	"github.com/pydio/cells/common/config"
)

// SslModeCmd permits configuration of used SSL mode.
var SslModeCmd = &cobra.Command{
	Use:   "mode",
	Short: "Manage HTTPS support on proxy",
	Long: `
This command lets you enable/disabled SSL on application main access point.

Four modes are currently supported :
- TLS mode : provide the paths to certificate and key (as you would on an apache server)
- Let's Encrypt: certificate is automagically generated during installation process, and later managed (e.g. renewed) by the embedded Caddy server
- Self-Signed : a self-signed certificate will be generated at each application start
- Disabled : application will be served on HTTP

`,
	Run: func(cmd *cobra.Command, args []string) {

		// Retrieve already defined conf
		extURL, _ := url.Parse(config.Get("defaults", "url").String(""))
		intURL, _ := url.Parse(config.Get("defaults", "urlInternal").String(""))

		// Get SSL info from end user
		enabled, e := promptSslMode()
		if e != nil {
			log.Fatal(e)
		}

		// Replace Main URLS
		if enabled {
			extURL.Scheme = "https"
			intURL.Scheme = "https"
		} else {
			extURL.Scheme = "http"
			intURL.Scheme = "http"
		}
		config.Set(extURL.String(), "defaults", "url")
		config.Set(intURL.String(), "defaults", "urlInternal")
		if e := config.Save("cli", "Update SSL mode"); e != nil {
			cmd.Println("Error while saving config: " + e.Error())
		}

		cmd.Println("*************************************************************")
		cmd.Println(" Config has been updated, please restart now!")
		cmd.Println("**************************************************************")

		// fmt.Printf("[DEBUG] ssl enable: %v, certFile: %s, keyFile: %s, certEmail: %s, caUrl: %s\n",
		// 	config.Get("cert", "proxy", "ssl").Bool(false),
		// 	config.Get("cert", "proxy", "certFile").String(""),
		// 	config.Get("cert", "proxy", "keyFile").String(""),
		// 	config.Get("cert", "proxy", "email").String(""),
		// 	config.Get("cert", "proxy", "caUrl").String(""))
	},
}

func promptSslMode() (enabled bool, e error) {

	certFile := config.Get("cert", "proxy", "certFile").String("")
	keyFile := config.Get("cert", "proxy", "keyFile").String("")
	certEmail := config.Get("cert", "proxy", "email").String("")
	caURL := config.Get("cert", "proxy", "caUrl").String(config.DefaultCaUrl)

	selector := promptui.Select{
		Label: "Choose SSL activation mode",
		Items: []string{
			"Provide paths to certificate/key files",
			"Use Let's Encrypt to automagically generate certificate during installation process",
			"Generate a self-signed certificate (for staging environments only!)",
			"Disable SSL (not recommended)",
		},
	}
	var i int
	i, _, e = selector.Run()
	if e != nil {
		return
	}

	switch i {
	case 0:
		certPrompt := promptui.Prompt{Label: "Provide absolute path to the HTTP certificate", Default: certFile}
		keyPrompt := promptui.Prompt{Label: "Provide absolute path to the HTTP private key", Default: keyFile}
		if certFile, e = certPrompt.Run(); e != nil {
			return
		}
		if keyFile, e = keyPrompt.Run(); e != nil {
			return
		}
		enabled = true
		// insure unused values are unset
		config.Del("cert", "proxy", "email")
		config.Del("cert", "proxy", "caUrl")

		config.Set(true, "cert", "proxy", "ssl")
		config.Set(false, "cert", "proxy", "self")
		config.Set(certFile, "cert", "proxy", "certFile")
		config.Set(keyFile, "cert", "proxy", "keyFile")

	case 1:
		mailPrompt := promptui.Prompt{Label: "Please enter the mail address for certificate generation", Default: certEmail}
		acceptLeSa := promptui.Prompt{Label: "Do you agree to the Let's Encrypt SA? [Y/n] ", Default: ""}

		if certEmail, e = mailPrompt.Run(); e != nil {
			return
		}

		val, e1 := acceptLeSa.Run()
		if e1 != nil {
			e = e1
			return
		}
		if !(val == "Y" || val == "y" || val == "") {
			e = fmt.Errorf("You must agree to Let's Encrypt SA to use automated certificate generation feature.")
			return
		}

		enabled = true
		config.Del("cert", "proxy", "certFile")
		config.Del("cert", "proxy", "keyFile")

		config.Set(true, "cert", "proxy", "ssl")
		config.Set(false, "cert", "proxy", "self")
		config.Set(certEmail, "cert", "proxy", "email")
		config.Set(caURL, "cert", "proxy", "caUrl")
	case 2:
		config.Del("cert", "proxy", "certFile")
		config.Del("cert", "proxy", "keyFile")
		config.Del("cert", "proxy", "email")
		config.Del("cert", "proxy", "caUrl")

		enabled = true
		config.Set(true, "cert", "proxy", "ssl")
		config.Set(true, "cert", "proxy", "self")
	case 3:
		config.Del("cert", "proxy", "self")
		config.Del("cert", "proxy", "certFile")
		config.Del("cert", "proxy", "keyFile")
		config.Del("cert", "proxy", "email")
		config.Del("cert", "proxy", "caUrl")

		config.Set(false, "cert", "proxy", "ssl")
	}

	enableRedir := false
	if enabled {
		redirPrompt := promptui.Select{
			Label: "Do you want to automatically redirect HTTP (80) to HTTPS? Warning: this requires the right to bind to port 80 on this machine.",
			Items: []string{
				"Yes",
				"No",
			}}
		if i, _, e = redirPrompt.Run(); e == nil && i == 0 {
			enableRedir = true
		}
	}
	if enableRedir {
		config.Set(true, "cert", "proxy", "httpRedir")
	} else if config.Get("cert", "proxy", "httpRedir").Bool(false) {
		config.Del("cert", "proxy", "httpRedir")
	}
	// config.Save("cli", "Install / Configure internal proxy")
	return
}

func init() {
	SslCmd.AddCommand(SslModeCmd)
}
