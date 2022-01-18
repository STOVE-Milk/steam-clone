// Code generated by protoc-gen-go-grpc. DO NOT EDIT.
// versions:
// - protoc-gen-go-grpc v1.2.0
// - protoc             v3.19.3
// source: proto/store.proto

package storepb

import (
	context "context"
	grpc "google.golang.org/grpc"
	codes "google.golang.org/grpc/codes"
	status "google.golang.org/grpc/status"
	emptypb "google.golang.org/protobuf/types/known/emptypb"
)

// This is a compile-time assertion to ensure that this generated file
// is compatible with the grpc package it is being compiled against.
// Requires gRPC-Go v1.32.0 or later.
const _ = grpc.SupportPackageIsVersion7

// StoreClient is the client API for Store service.
//
// For semantics around ctx use and closing/ending streaming RPCs, please refer to https://pkg.go.dev/google.golang.org/grpc/?tab=doc#ClientConn.NewStream.
type StoreClient interface {
	GetCategoryList(ctx context.Context, in *emptypb.Empty, opts ...grpc.CallOption) (*CategoryListResponse, error)
	GetGameListByCategory(ctx context.Context, in *CategoryQueryParamRequest, opts ...grpc.CallOption) (*GameSimpleListResponse, error)
	GetGame(ctx context.Context, in *GameIdQueryParamRequest, opts ...grpc.CallOption) (*GameDetail, error)
	GetDiscountingGameList(ctx context.Context, in *emptypb.Empty, opts ...grpc.CallOption) (*GameSimpleListResponse, error)
}

type storeClient struct {
	cc grpc.ClientConnInterface
}

func NewStoreClient(cc grpc.ClientConnInterface) StoreClient {
	return &storeClient{cc}
}

func (c *storeClient) GetCategoryList(ctx context.Context, in *emptypb.Empty, opts ...grpc.CallOption) (*CategoryListResponse, error) {
	out := new(CategoryListResponse)
	err := c.cc.Invoke(ctx, "/storepb.Store/GetCategoryList", in, out, opts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

func (c *storeClient) GetGameListByCategory(ctx context.Context, in *CategoryQueryParamRequest, opts ...grpc.CallOption) (*GameSimpleListResponse, error) {
	out := new(GameSimpleListResponse)
	err := c.cc.Invoke(ctx, "/storepb.Store/GetGameListByCategory", in, out, opts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

func (c *storeClient) GetGame(ctx context.Context, in *GameIdQueryParamRequest, opts ...grpc.CallOption) (*GameDetail, error) {
	out := new(GameDetail)
	err := c.cc.Invoke(ctx, "/storepb.Store/GetGame", in, out, opts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

func (c *storeClient) GetDiscountingGameList(ctx context.Context, in *emptypb.Empty, opts ...grpc.CallOption) (*GameSimpleListResponse, error) {
	out := new(GameSimpleListResponse)
	err := c.cc.Invoke(ctx, "/storepb.Store/GetDiscountingGameList", in, out, opts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

// StoreServer is the server API for Store service.
// All implementations must embed UnimplementedStoreServer
// for forward compatibility
type StoreServer interface {
	GetCategoryList(context.Context, *emptypb.Empty) (*CategoryListResponse, error)
	GetGameListByCategory(context.Context, *CategoryQueryParamRequest) (*GameSimpleListResponse, error)
	GetGame(context.Context, *GameIdQueryParamRequest) (*GameDetail, error)
	GetDiscountingGameList(context.Context, *emptypb.Empty) (*GameSimpleListResponse, error)
	mustEmbedUnimplementedStoreServer()
}

// UnimplementedStoreServer must be embedded to have forward compatible implementations.
type UnimplementedStoreServer struct {
}

func (UnimplementedStoreServer) GetCategoryList(context.Context, *emptypb.Empty) (*CategoryListResponse, error) {
	return nil, status.Errorf(codes.Unimplemented, "method GetCategoryList not implemented")
}
func (UnimplementedStoreServer) GetGameListByCategory(context.Context, *CategoryQueryParamRequest) (*GameSimpleListResponse, error) {
	return nil, status.Errorf(codes.Unimplemented, "method GetGameListByCategory not implemented")
}
func (UnimplementedStoreServer) GetGame(context.Context, *GameIdQueryParamRequest) (*GameDetail, error) {
	return nil, status.Errorf(codes.Unimplemented, "method GetGame not implemented")
}
func (UnimplementedStoreServer) GetDiscountingGameList(context.Context, *emptypb.Empty) (*GameSimpleListResponse, error) {
	return nil, status.Errorf(codes.Unimplemented, "method GetDiscountingGameList not implemented")
}
func (UnimplementedStoreServer) mustEmbedUnimplementedStoreServer() {}

// UnsafeStoreServer may be embedded to opt out of forward compatibility for this service.
// Use of this interface is not recommended, as added methods to StoreServer will
// result in compilation errors.
type UnsafeStoreServer interface {
	mustEmbedUnimplementedStoreServer()
}

func RegisterStoreServer(s grpc.ServiceRegistrar, srv StoreServer) {
	s.RegisterService(&Store_ServiceDesc, srv)
}

func _Store_GetCategoryList_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(emptypb.Empty)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(StoreServer).GetCategoryList(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: "/storepb.Store/GetCategoryList",
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(StoreServer).GetCategoryList(ctx, req.(*emptypb.Empty))
	}
	return interceptor(ctx, in, info, handler)
}

func _Store_GetGameListByCategory_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(CategoryQueryParamRequest)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(StoreServer).GetGameListByCategory(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: "/storepb.Store/GetGameListByCategory",
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(StoreServer).GetGameListByCategory(ctx, req.(*CategoryQueryParamRequest))
	}
	return interceptor(ctx, in, info, handler)
}

func _Store_GetGame_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(GameIdQueryParamRequest)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(StoreServer).GetGame(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: "/storepb.Store/GetGame",
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(StoreServer).GetGame(ctx, req.(*GameIdQueryParamRequest))
	}
	return interceptor(ctx, in, info, handler)
}

func _Store_GetDiscountingGameList_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(emptypb.Empty)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(StoreServer).GetDiscountingGameList(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: "/storepb.Store/GetDiscountingGameList",
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(StoreServer).GetDiscountingGameList(ctx, req.(*emptypb.Empty))
	}
	return interceptor(ctx, in, info, handler)
}

// Store_ServiceDesc is the grpc.ServiceDesc for Store service.
// It's only intended for direct use with grpc.RegisterService,
// and not to be introspected or modified (even as a copy)
var Store_ServiceDesc = grpc.ServiceDesc{
	ServiceName: "storepb.Store",
	HandlerType: (*StoreServer)(nil),
	Methods: []grpc.MethodDesc{
		{
			MethodName: "GetCategoryList",
			Handler:    _Store_GetCategoryList_Handler,
		},
		{
			MethodName: "GetGameListByCategory",
			Handler:    _Store_GetGameListByCategory_Handler,
		},
		{
			MethodName: "GetGame",
			Handler:    _Store_GetGame_Handler,
		},
		{
			MethodName: "GetDiscountingGameList",
			Handler:    _Store_GetDiscountingGameList_Handler,
		},
	},
	Streams:  []grpc.StreamDesc{},
	Metadata: "proto/store.proto",
}
