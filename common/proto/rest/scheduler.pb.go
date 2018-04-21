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

// Code generated by protoc-gen-go. DO NOT EDIT.
// source: scheduler.proto

package rest

import proto "github.com/golang/protobuf/proto"
import fmt "fmt"
import math "math"
import jobs "github.com/pydio/cells/common/proto/jobs"

// Reference imports to suppress errors if they are not otherwise used.
var _ = proto.Marshal
var _ = fmt.Errorf
var _ = math.Inf

type UserJobRequest struct {
	JobName        string `protobuf:"bytes,1,opt,name=JobName" json:"JobName,omitempty"`
	JsonParameters string `protobuf:"bytes,2,opt,name=JsonParameters" json:"JsonParameters,omitempty"`
}

func (m *UserJobRequest) Reset()                    { *m = UserJobRequest{} }
func (m *UserJobRequest) String() string            { return proto.CompactTextString(m) }
func (*UserJobRequest) ProtoMessage()               {}
func (*UserJobRequest) Descriptor() ([]byte, []int) { return fileDescriptor8, []int{0} }

func (m *UserJobRequest) GetJobName() string {
	if m != nil {
		return m.JobName
	}
	return ""
}

func (m *UserJobRequest) GetJsonParameters() string {
	if m != nil {
		return m.JsonParameters
	}
	return ""
}

type UserJobResponse struct {
	JobUuid string `protobuf:"bytes,1,opt,name=JobUuid" json:"JobUuid,omitempty"`
}

func (m *UserJobResponse) Reset()                    { *m = UserJobResponse{} }
func (m *UserJobResponse) String() string            { return proto.CompactTextString(m) }
func (*UserJobResponse) ProtoMessage()               {}
func (*UserJobResponse) Descriptor() ([]byte, []int) { return fileDescriptor8, []int{1} }

func (m *UserJobResponse) GetJobUuid() string {
	if m != nil {
		return m.JobUuid
	}
	return ""
}

type UserJobsCollection struct {
	Jobs []*jobs.Job `protobuf:"bytes,1,rep,name=Jobs" json:"Jobs,omitempty"`
}

func (m *UserJobsCollection) Reset()                    { *m = UserJobsCollection{} }
func (m *UserJobsCollection) String() string            { return proto.CompactTextString(m) }
func (*UserJobsCollection) ProtoMessage()               {}
func (*UserJobsCollection) Descriptor() ([]byte, []int) { return fileDescriptor8, []int{2} }

func (m *UserJobsCollection) GetJobs() []*jobs.Job {
	if m != nil {
		return m.Jobs
	}
	return nil
}

func init() {
	proto.RegisterType((*UserJobRequest)(nil), "rest.UserJobRequest")
	proto.RegisterType((*UserJobResponse)(nil), "rest.UserJobResponse")
	proto.RegisterType((*UserJobsCollection)(nil), "rest.UserJobsCollection")
}

func init() { proto.RegisterFile("scheduler.proto", fileDescriptor8) }

var fileDescriptor8 = []byte{
	// 211 bytes of a gzipped FileDescriptorProto
	0x1f, 0x8b, 0x08, 0x00, 0x00, 0x00, 0x00, 0x00, 0x02, 0xff, 0x5c, 0x8e, 0xc1, 0x4a, 0xc5, 0x30,
	0x10, 0x45, 0xa9, 0x3e, 0x94, 0x46, 0x68, 0x21, 0xab, 0x20, 0x08, 0xa5, 0x0b, 0x29, 0x08, 0x0d,
	0x58, 0xf0, 0x07, 0xdc, 0x75, 0x21, 0x52, 0xe8, 0x07, 0x34, 0xe9, 0x60, 0x23, 0x4d, 0xa6, 0x66,
	0x12, 0xc1, 0xbf, 0x97, 0xc6, 0x2a, 0xf2, 0x36, 0x03, 0xf7, 0x72, 0xe6, 0x70, 0x59, 0x49, 0x7a,
	0x81, 0x39, 0xae, 0xe0, 0xdb, 0xcd, 0x63, 0x40, 0x7e, 0xf2, 0x40, 0xe1, 0xf6, 0xe9, 0xcd, 0x84,
	0x25, 0xaa, 0x56, 0xa3, 0x95, 0xdb, 0xd7, 0x6c, 0x50, 0x12, 0xf8, 0x4f, 0xa3, 0x81, 0xa4, 0x46,
	0x6b, 0xd1, 0xc9, 0x44, 0xcb, 0x77, 0x54, 0x94, 0xce, 0xcf, 0x77, 0x3d, 0xb0, 0x62, 0x24, 0xf0,
	0x3d, 0xaa, 0x01, 0x3e, 0x22, 0x50, 0xe0, 0x82, 0x5d, 0xf7, 0xa8, 0x5e, 0x26, 0x0b, 0x22, 0xab,
	0xb2, 0x26, 0x1f, 0x7e, 0x23, 0xbf, 0x67, 0x45, 0x4f, 0xe8, 0x5e, 0x27, 0x3f, 0x59, 0x08, 0xe0,
	0x49, 0x5c, 0x24, 0xe0, 0xac, 0xad, 0x1f, 0x58, 0xf9, 0xe7, 0xa4, 0x0d, 0x1d, 0xc1, 0x21, 0x1d,
	0xa3, 0x99, 0xff, 0x49, 0xf7, 0x58, 0x77, 0x8c, 0x1f, 0x30, 0x3d, 0xe3, 0xba, 0x82, 0x0e, 0x06,
	0x1d, 0xbf, 0x63, 0xa7, 0xbd, 0x11, 0x59, 0x75, 0xd9, 0xdc, 0x3c, 0xe6, 0x6d, 0x5a, 0xbc, 0x0b,
	0x53, 0xad, 0xae, 0xd2, 0xf8, 0xee, 0x3b, 0x00, 0x00, 0xff, 0xff, 0x32, 0xaf, 0x27, 0xfd, 0x0d,
	0x01, 0x00, 0x00,
}