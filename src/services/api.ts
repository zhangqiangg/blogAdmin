import { stringify } from 'qs';
import request from '@/utils/request';

// 文章
export async function addArticle(params: any) {
  return request('/api/addArticle', {
    method: 'POST',
    data: params,
  });
}

export async function updateArticle(params: any) {
  return request('/api/updateArticle', {
    method: 'POST',
    data: params,
  });
}

export async function getArticleList(params: any) {
  return request(`/api/getArticleList?${stringify(params)}`);
}

export async function deleteArticle(params: any) {
  return request(`/api/deleteArticle?${stringify(params)}`);
}
