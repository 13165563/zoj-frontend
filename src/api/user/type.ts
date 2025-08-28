/**
 * 用户类型定义
 */

// 用户基本信息
export interface User {
  id?: number;
  userName?: string;
  userAvatar?: string;
  userProfile?: string;
  userRole?: string;
  createTime?: Date;
  updateTime?: Date;
}

// 登录用户信息
export interface LoginUser extends User {
  token?: string;
}

// 用户登录请求
export interface UserLoginRequest {
  userAccount: string;
  userPassword: string;
}

// 用户注册请求
export interface UserRegisterRequest {
  userAccount: string;
  userPassword: string;
  checkPassword: string;
}

// 用户查询请求
export interface UserQueryRequest {
  id?: number;
  userName?: string;
  userRole?: string;
  current?: number;
  pageSize?: number;
  sortField?: string;
  sortOrder?: string;
}

// 用户视图对象
export interface UserVO extends User {
  // 视图对象可以与基础用户对象相同，或者根据需要添加额外字段
}

// 登录用户视图对象
export interface LoginUserVO extends User {
  token?: string;
}