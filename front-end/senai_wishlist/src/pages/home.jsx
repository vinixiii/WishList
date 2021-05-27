import { Component } from 'react';

import logo from '../img/logo-wishlist.svg';
import search from '../img/search.svg';
import send from '../img/send.svg';
import Modal from '../components/modal'

import '../styles/home.css';

export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      wishes: [],
      isTrue: false,
      email: '',
      pwd: '',
      idUsuario: 0,
      wish: '',
      isLogged: false
    };
  };

  listWishes = () => {
    fetch('http://localhost:5000/api/desejos')
    .then(response => response.json())
    .then(data => this.setState({wishes: data}))
    .catch(error => console.log(error));
  }

  registerWish = async (e) => {
    e.preventDefault();
    this.setState({isTrue: false});

    await fetch('http://localhost:5000/api/login', {
      method: 'POST',

      body: {
        email: this.state.email,
        senha: this.state.pwd
      },

      headers: {
        'Content-Type': 'application/json' 
      }
    })
    .then(response => response.json())
    .then(data => this.setState({idUsuario: data}))
    .catch(error => console.log(error))
    .then(() => this.setState({isLogged: true}));

    if (this.state.isLogged) {
      fetch('http://localhost:5000/api/desejos', {
        method: 'POST',
  
        body: {
          descricao: this.state.wish,
          dataCriacao: Date.now(),
          idUsuario: this.state.idUsuario
        },
  
        headers: {
          'Content-Type': 'application/json' 
        }
      })
      .then(console.log('Cadastrado'))
      .catch(error => console.log(error))
      .then(this.listWishes());
    }
  };

  componentDidMount() {
    this.listWishes();
  }

  render() {
    return(
      <>
        <header>
          <img id="logo" src={logo} alt="Logo WishList" />
        </header>

        <main>
          <section id="container">

            <div id="table-top">
              <form id="input-container">
                <label>Buscar desejos</label>
                <div id="input-content">
                  <img src={search} alt="Ícone de busca" />
                  <input type="text" placeholder="E-mail" />
                  <button type="submit"><img src={send} alt="" /></button>
                </div>
              </form>
              <button className="btn" onClick={() => {this.setState({isTrue: true})}}>+ Add desejo</button>
            </div>

            <table className="data-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Desejo</th>
                  <th>Data</th>
                  <th>Email</th>
                </tr>
              </thead>
              <tbody>
                {
                  this.state.wishes.map(w => {
                    return (
                      <tr key={w.idDesejo}>
                        <td>{w.idDesejo}</td>
                        <td>{w.descricao}</td>
                        <td>{w.dataCriacao}</td>
                        <td>{w.idUsuarioNavigation.email}</td>
                      </tr>
                    )
                  })
                }
              </tbody>
            </table>

          </section>

          <Modal isOpen={this.state.isTrue}>
            <div className="form">
              <h2>Novo desejo</h2>

              <form>
                <div className="input-group">
                  <label className="modal-label">E-mail</label>
                  <input 
                    className="modal-input"
                    type="text"
                    value={this.state.email}
                    onChange={e => {this.setState({email: e.target.value}); console.log(this.state.email);}}
                  />
                </div>

                <div className="input-group">
                  <label className="modal-label">Senha</label>
                  <input
                    className="modal-input"
                    type="text"
                    value={this.state.pwd}
                    onChange={e => {this.setState({pwd: e.target.value}); console.log(this.state.pwd);}}
                  />
                </div>

                <div className="input-group">
                  <label className="modal-label">Desejo</label>
                  <input
                    className="modal-input"
                    type="text"
                    value={this.state.wish}
                    onChange={e => {this.setState({wish: e.target.value}); console.log(this.state.wish);}}
                  />
                </div>

                <div className="buttons">
                  <button className="btn cancel" onClick={() => this.setState({isTrue: false})} type="button">Cancelar</button>
                  <button className="btn" onClick={(e) => this.registerWish(e)}>Confirmar</button>
                </div>
              </form>
            </div>
          </Modal>
        </main>
      </>
    );
  };
};
