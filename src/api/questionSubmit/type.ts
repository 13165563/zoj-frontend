/**
 * 题目提交类型定义
 */

// 题目提交基本信息
export interface QuestionSubmit {
  id?: number;
  language?: string;
  code?: string;
  judgeInfo?: string;
  status?: number;
  questionId?: number;
  userId?: number;
  createTime?: Date;
  updateTime?: Date;
  isDelete?: number;
}

// 题目提交查询请求
export interface QuestionSubmitQueryRequest {
  id?: number;
  language?: string;
  status?: number;
  questionId?: number;
  userId?: number;
  current?: number;
  pageSize?: number;
  sortField?: string;
  sortOrder?: string;
}

// 题目提交视图对象
export interface QuestionSubmitVO extends QuestionSubmit {
  question?: any; // 题目信息
  user?: any; // 用户信息
  statusText?: string;
  languageText?: string;
}