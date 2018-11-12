import React, { Component } from 'react';

//Error Boundaries: reactjs.org/docs/error-boundaries.html
// They only catch errors in the components below them and can't self-check
class ErrorBoundary extends Component {
    constructor(props) {
      super(props);
      this.state = { hasError: false };
    }

    componentDidCatch(error, info) {
      this.setState({ hasError: true });
    }

    render() {
      if (this.state.hasError) {
        return <h1>Something went wrong.</h1>;
      }
      return this.props.children;
    }
  }

export default ErrorBoundary
