import { Component } from '../litete';

export default class TestElem extends Component {
  constructor(props) {
    super(props);
  }

  sayHello = (e) => {
    alert(this.props.greeetingTest);
    console.log(this.props);
  }

  alert = (userName) => {
    alert(userName);
  }

  loadUsers = async () => {
    let k = await fetch('https://jsonplaceholder.typicode.com/users');
    let data = await k.json();
    this.ht = data.map((user) => {
      return `<li onclick="alert.bind(null, '${ user.name }')">${ user.name }</li>`;
    }).join('');
  }

  onMount() {
    // return if making api calls
    return this.loadUsers();

    // no need to return if not making api calls
    // this.ht = [1,2,3].map((k) => {
    //    return `<li>${ k }</li>`;
    // }).join('');
  }

  render() {
    const { greeetingTest } = this.props;
    return(`<div> 
      ${ greeetingTest }
      <button onclick='sayHello'>click</button>
      <ul>
        ${ this.ht }
      </ul>
    </div>`);
  }
}