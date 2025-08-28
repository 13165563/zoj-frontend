import http from '@/plugins/axios';
import type {
  BaseResponse,
  Page,
} from '@/api/common/type';
import type {
  User,
  UserLoginRequest,
  UserRegisterRequest,
  UserQueryRequest,
  UserVO,
  LoginUserVO,
} from './type';

/**
 * 用户相关 API 接口
 */

// 用户注册
export const userRegister = (data: UserRegisterRequest) => {
  return http.post<BaseResponse<number>>('/user/register', data);
};

// 用户登录
export const userLogin = (data: UserLoginRequest) => {
  return http.post<BaseResponse<LoginUserVO>>('/user/login', data);
};

// 用户登出
export const userLogout = () => {
  return http.post<BaseResponse<boolean>>('/user/logout');
};

// 获取当前登录用户
export const getLoginUser = () => {
  return http.get<BaseResponse<LoginUserVO>>('/user/get/login');
};

// 根据id获取用户
export const getUserById = (id: number) => {
  return http.get<BaseResponse<User>>('/user/get', {
    params: { id }
  });
};

// 根据id获取用户VO
export const getUserVOById = (id: number) => {
  return http.get<BaseResponse<UserVO>>('/user/get/vo', {
    params: { id }
  });
};

// 分页获取用户列表
export const listUserByPage = (data: UserQueryRequest) => {
  return http.post<BaseResponse<Page<User>>>('/user/list/page', data);
};

// 分页获取用户VO列表
export const listUserVOByPage = (data: UserQueryRequest) => {
  return http.post<BaseResponse<Page<UserVO>>>('/user/list/page/vo', data);
};

// 添加用户
export const addUser = (data: User) => {
  return http.post<BaseResponse<number>>('/user/add', data);
};

// 更新用户
export const updateUser = (data: User) => {
  return http.post<BaseResponse<boolean>>('/user/update', data);
};

// 更新当前用户
export const updateMyUser = (data: User) => {
  return http.post<BaseResponse<boolean>>('/user/update/my', data);
};

// 删除用户
export const deleteUser = (id: number) => {
  return http.post<BaseResponse<boolean>>('/user/delete', { id });
};