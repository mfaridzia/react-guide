import axios from 'axios';
import React, { Component } from 'react';
import './App.css';
import loadingGif from './loading.gif';
import ListItem from './ListItem';

class App extends Component {
  constructor() {
    super();
    this.state = {
      newTodo: '',
      editing: false,
      editingIndex: null,
      notification: null,
      todos: [],
      loading: true,
    }

    // url endpoint api
    this.urlApi = 'https://5bbfabdd72de1d00132537dc.mockapi.io';

    this.handleChange = this.handleChange.bind(this);
    this.addTodo = this.addTodo.bind(this);
    this.deleteTodo = this.deleteTodo.bind(this);
    this.editTodo = this.editTodo.bind(this);
    this.updateTodo = this.updateTodo.bind(this);
    this.alert = this.alert.bind(this);
  }

  async componentDidMount() {
    const response = await axios.get(`${this.urlApi}/todos`);
    
    setTimeout(() => {
      this.setState({
        todos: response.data,
        loading: false
      })
    }, 1000);
  }

  // event handling
  handleChange (event) {
    this.setState({
      newTodo: event.target.value
    })
  }

  // TODOLIST : Membuat loading ketika proses, tambah, update dan delete

  async addTodo() {
    const response = await axios.post(`${this.urlApi}/todos`, {
      name: this.state.newTodo
    })

    const todos = this.state.todos;
    todos.push(response.data);

    this.setState({
      todos: todos,
      newTodo: '',
    });

    this.alert('Todo added successfully!');
  }

  editTodo(index) {
    const todo = this.state.todos[index];
    this.setState({
      editing: true,
      newTodo: todo.name,
      editingIndex: index
    });
  }

  async updateTodo() {
    const todo = this.state.todos[this.state.editingIndex];

    const response = await axios.put(`${this.urlApi}/todos/${todo.id}`, {
      name: this.state.newTodo
    });

    const todos = this.state.todos;
    todos[this.state.editingIndex] = response.data;

    this.setState({
      todos,
      editing: false,
      editingIndex: null,
      newTodo: ''
    });

    this.alert('Todo updated successfully!');
  }

  async deleteTodo (index) {
    const todos = this.state.todos;
    const todo = this.state.todos[index];

    await axios.delete(`${this.urlApi}/todos/${todo.id}`);

    delete todos[index];

    this.setState({ todos });

    this.alert('Todo deleted successfully!');
  }

  // notification message
  alert(notification) {
    this.setState({
      notification
    });
    
    setTimeout(()=> {
      this.setState({
        notification: null
      });
    }, 2000);
  }


  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h2 className="text-center p-4">Todos App</h2>
          <div className="container">
          {
            this.state.notification &&
            <div className="alert mt-3 alert-success"> 
              <p className="text-center"> { this.state.notification } </p>
            </div>   
          }
            <input type="text" 
              className="my-4 form-control"
              name="todo" 
              onChange={this.handleChange} 
              value={this.state.newTodo}
              placeholder="Type your todos..."
            />
            <button 
              className="btn-success mb-3 form-control" 
              disabled={ this.state.newTodo.length < 5 }
              onClick={ this.state.editing ? this.updateTodo : this.addTodo }
            >
              { this.state.editing ? 'Edit todo' : 'Add todo' }
            </button>

            {
              this.state.loading && 
              <img src={loadingGif} alt="Loading" className="loading"/>
            }

            {
              (!this.state.editing || this.state.loading) && 
              <ul className="list-group">
              { this.state.todos.map((item, index) => {
                return <ListItem 
                  key={item.id}
                  item={item}
                  editTodo={() => { this.editTodo(index) }}
                  deleteTodo={() => { this.deleteTodo(index) }}
                />
              })}
            </ul>
            }
          </div>
        </header>
      </div>
    );
  }
}

export default App;
