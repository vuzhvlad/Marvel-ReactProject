import { Component } from "react";
import ErrorMessage from "../errorMessage/ErrorMsg";

class ErrorBoundary extends Component {
    state = {
        error: false
    }

    componentDidCatch(err, info) { // hook for catching errors that takes two param inside, error- error, info - the place where it happened
        console.log(err, info);

        this.setState({error: true}); // if mistake happened error will be true
    }

    render() {
        if(this.state.error) {
            return <ErrorMessage/>
        }

        return this.props.children; // children of ErrorBoundary
    }
}

export default ErrorBoundary;

// it can catch mistakes inside of it childrens, render and constructor, but it cant catch a mistake inside of events, async code and inside of itself!!!!!!!!!!!!!!