import {View, Text} from 'react-native';
import {useRouteError} from 'react-router-dom';

const ErrorPage = (): React.JSX.Element => {
  const error = useRouteError();
  console.error(error);

  return (
    <View id="error-page">
      <Text>Oops!</Text>
      <Text>Sorry, an unexpected error has occurred.</Text>
      <Text>
        <Text>{error.statusText || error.message}</Text>
      </Text>
    </View>
  );
};

export default ErrorPage;
