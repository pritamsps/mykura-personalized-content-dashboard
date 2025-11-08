import {Provider} from 'react-redux';
import { AppProps } from 'next/app';
import {store} from '../store/store';
import "../styles/global.css"
import AppContent from '@/components/AppContent'
import { ApiProvider } from '@reduxjs/toolkit/query/react';
import { apiSlice } from '@/features/api/apiSlice';

export default function App({ Component, pageProps, router }: AppProps) {
  return (
    <ApiProvider api={apiSlice}>
    <Provider store={store}>
      <AppContent Component={Component} pageProps={pageProps} router={router} />
    </Provider>
    </ApiProvider>
  );
}