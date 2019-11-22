import { Reducer } from 'redux';
import { Effect } from 'dva';
// import { stringify } from 'querystring';
import * as API from '@/services/api';

export interface StateType {
  total: Number;
  pageNum: Number;
  articleList: any[];
}

export interface ArticleModelType {
  namespace: String;
  state: StateType;
  effects: {
    addArticle: Effect;
    updateArticle: Effect;
    getArticleList: Effect;
    deleteArticle: Effect;
  };
  reducers: {
    saveArticleList: Reducer<StateType>;
    saveArticleListTotal: Reducer<StateType>;
    saveArticlePageNum: Reducer<StateType>;
  };
}

const Model: ArticleModelType = {
  namespace: 'article',
  state: {
    total: 0,
    pageNum: 10,
    articleList: [],
  },
  effects: {
    *addArticle({ payload }, { call, put }) {
      const response = yield call(API.addArticle, payload);
      yield put({ type: 'save', payload: { response } });
    },
    *updateArticle({ payload }, { call, put }) {
      const response = yield call(API.addArticle, payload);
      yield put({ type: 'save', payload: { response } });
    },
    *getArticleList({ payload }, { call, put }) {
      const response = yield call(API.addArticle, payload);
      yield put({ type: 'save', payload: { response } });
    },
    *deleteArticle({ payload }, { call, put }) {
      const response = yield call(API.addArticle, payload);
      yield put({ type: 'save', payload: { response } });
    },
  },
  reducers: {
    saveArticleList(state, { payload }) {
      return {
        ...state,
        articleList: payload,
      };
    },
    saveArticleListTotal(state, { payload }) {
      return {
        ...state,
        articleList: payload,
      };
    },
    saveArticlePageNum(state, { payload }) {
      return {
        ...state,
        articleList: payload,
      };
    },
  },
};

export default Model;
