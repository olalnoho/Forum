import React, { useContext, useEffect } from 'react';
import { Switch, Route } from 'react-router-dom'
import { ApolloProvider } from '@apollo/react-hooks';
import { ApolloClient, HttpLink, ApolloLink, InMemoryCache } from 'apollo-boost';

import Header from './components/Layout/Header/Header'
import Login from './components/Auth/Login/Login'
import Register from './components/Auth/Register/Register'

import Create from './components/Layout/Landing/Create'
import Landing from './components/Layout/Landing/Landing'

//import Footer from './components/Layout/Footer/Footer'
import Thread from './components/Thread/Thread'

import { GlobalContext } from './context/Global'

const httpLink = new HttpLink({ uri: 'http://localhost:4000/graphql' });

const authLink = new ApolloLink((operation, forward) => {
  const token = localStorage.getItem('token');

  operation.setContext({
    headers: {
      "x-auth-token": token ? token : ''
    }
  });

  return forward(operation);
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
})

function App() {
  const context = useContext(GlobalContext)

  useEffect(() => {
    if (localStorage.getItem('isAuth')) {
      context.setIsAuth(true)
    } else {
      context.setIsAuth(false)
    }
  }, [context])

  return (
    <ApolloProvider client={client}>
      <Header />
      <Switch>
        <Route path="/" exact component={Landing} />
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
        <Route path="/threads/create/:id" component={Create} />
        <Route path="/threads/:id" component={Thread} />
      </Switch>
      {/* <Footer /> */}
    </ApolloProvider>
  );
}

export default App;
