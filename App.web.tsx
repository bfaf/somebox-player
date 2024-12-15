import React from 'react';
import { Provider as StoreProvider } from 'react-redux';
import { setupStore } from './src/redux/store';
import { createAxiosResponseInterceptor } from './src/services/setupInterceptors';
import InitSettings from './src/stacks/initSettings';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import ErrorPage from './src/components/errorPage.web';
import Login from './src/stacks/login';
import List from './src/stacks/list';
import VideoPlayer, { videoLoader } from './src/stacks/video-player.web';
import Details, { detailsLoader } from './src/stacks/details.web';

createAxiosResponseInterceptor();

const router = createBrowserRouter([
  {
    path: '/',
    element: <InitSettings />,
    errorElement: <ErrorPage />,
  },
  {
    path: 'login',
    element: <Login />,
  },
  {
    path: 'list',
    element: <List />,
  },
  {
    path: 'video/:videoId/:seriesId/:continue',
    element: <VideoPlayer />,
    loader: videoLoader,
  },
  {
    path: 'details/:videoId',
    element: <Details />,
    loader: detailsLoader,
  },
]);

function App(): React.JSX.Element {
  return (
    <StoreProvider store={setupStore()}>
      <RouterProvider router={router} />
    </StoreProvider>
  );
}

export default App;
