import React, { useState, useEffect } from 'react';
import ProgressBar from './progressBar';
import { getElements } from './axios';

class LikeDislikeManager extends React.Component {
    constructor(props) {
        super(props);
        const { item, elements } = this.props;
            this.state = {
                likeSave: false,
                dislikeSave: false,
                likes: props.item.likes,
                dislikes: props.item.dislikes,
                elements: elements
            };
        }

    componentDidMount() {
        const { item } = this.props;
        const likeStoredValue = localStorage.getItem(`likeSave-${item.song_id}`);
        const dislikeStoredValue = localStorage.getItem(`dislikeSave-${item.song_id}`);
        if (likeStoredValue !== null) {
            this.setState({ likeSave: likeStoredValue === "true" });
        }
            if (dislikeStoredValue !== null) {
                this.setState({ dislikeSave: dislikeStoredValue === "true" });
            }
            if (localStorage.getItem('theme') === "dark") {
                let elements = document.querySelectorAll('*')
                let button = document.querySelector('#theme')
                elements.forEach(element => {
                    element.classList.add('dark-theme');
                    button.checked = true;
                })
            } else if (localStorage.getItem('theme') === "light") {
                let elements = document.querySelectorAll('*')
                let button = document.querySelector('#theme')
                elements.forEach(element => {
                    element.classList.remove('dark-theme');
                    button.checked = false;
                })
        }
    }  

    componentDidUpdate(prevProps) {
        // Sprawdź, czy propsy się zmieniły (np. załadowano nowe elementy)
        if (prevProps.refresh !== this.props.refresh) {
            const { refresh, item } = this.props;
            refresh.forEach((element) => {
                if (element.song_id === item.song_id) {
                    this.setState((prevState) => ({
                        likes: element.likes,
                        dislikes: element.dislikes,
                        elements: refresh,
                        likeSave: prevState.likeSave, // Zachowaj poprzedni stan "likeSave"
                        dislikeSave: prevState.dislikeSave, // Zachowaj poprzedni stan "dislikeSave"
                    }));
                }
            })
        }
    }

    refreshData = async () => {
        try {
          // Pozyskaj najnowsze dane
            const get = await getElements();
          const { item } = this.props;
          const updatedItem = get.find((el) => el.song_id === item.song_id);
      
          if (updatedItem) {
              if (updatedItem.song_id === item.song_id) {
                this.setState({
                    likes: updatedItem.likes,
                    dislikes: updatedItem.dislikes,
                    elements: get,
                });
              }
          }
        } catch (error) {
          console.error(error);
        }
      };
  
    handleLikeChange = (event, itemId) => {
        const dislikeSave = this.state.dislikeSave;
        var secButton = dislikeSave ? true : false;
        this.setState({ likeSave: event.target.checked, dislikeSave: !event.target.checked });
        const { item } = this.props;
        localStorage.setItem(`likeSave-${item.song_id}`, event.target.checked);
        localStorage.setItem(`dislikeSave-${item.song_id}`, !event.target.checked);
        this.likeSystem(event, itemId, secButton)
    };
  
    handleDislikeChange = (event, itemId) => {
        const likeSave = this.state.likeSave;
        var secButton = likeSave ? true : false;
        this.setState({ dislikeSave: event.target.checked, likeSave: !event.target.checked });
        const { item } = this.props;
        localStorage.setItem(`dislikeSave-${item.song_id}`, event.target.checked);
        localStorage.setItem(`likeSave-${item.song_id}`, !event.target.checked);
        this.dislikeSystem(event, itemId, secButton);
    };

    likeSystem = async (event, itemId, secButton) => {
        try {
            var { elements } = this.props;
            var get = await getElements();
            elements = get;
            const item = elements.find((el) => el.song_id === itemId);
            if (!item) return; // Jeśli nie znaleziono elementu o podanym itemId, zakończ funkcję
            
            if (event.target.checked && secButton === true) {
                // Zmniejsz liczbę dislikes i zwiększ liczbę likes o 1
                item.dislikes -= 1;
                item.likes += 1;
                // Wyślij żądanie PUT do serwera, aby zaktualizować liczbę dislikes i likes
                const data = { likes: item.likes, dislikes: item.dislikes };
                // await updateElement(item._id.toString(), data);
          } else if (event.target.checked && secButton === false) {
                // Zwiększ liczbę likes o 1
                item.likes += 1;
                // Wyślij żądanie PUT do serwera, aby zaktualizować liczbę likes
                const data = { likes: item.likes };
                // await updateElement(item._id.toString(), data);
          }
      
          // Zaktualizuj stan komponentu
            this.setState({ likes: item.likes, dislikes: item.dislikes });
            this.refreshData();
        } catch (error) {
          console.error(error);
        }
      };
      
      
      dislikeSystem = async (event, itemId, secButton) => {
        try {
            var { elements } = this.props;
            var get = await getElements();  
            elements = get;
            const item = elements.find((el) => el.song_id === itemId);
            if (!item) return; // Jeśli nie znaleziono elementu o podanym itemId, zakończ funkcję
        
            if (event.target.checked && secButton === true) {
                // Zmniejsz liczbę likes i zwiększ liczbę dislikes o 1
                item.likes -= 1;
                item.dislikes += 1;
                // Wyślij żądanie PUT do serwera, aby zaktualizować liczbę dislikes i likes
                const data = { likes: item.likes, dislikes: item.dislikes };
                // await updateElement(item._id.toString(), data);
            } else if (event.target.checked && secButton === false) {
                // Zwiększ liczbę dislikes o 1
                item.dislikes += 1;
                // Wyślij żądanie PUT do serwera, aby zaktualizować liczbę dislikes
                const data = { dislikes: item.dislikes };
                // await updateElement(item._id.toString(), data);
            }
        
            // Zaktualizuj stan komponentu
            this.setState({ likes: item.likes, dislikes: item.dislikes });
            this.refreshData();
        } catch (error) {
            console.error(error);
        }
      };
      
    

        
    render() {
        const { item } = this.props;
        return (
            <div className="PlaylistSectionItemCoverArt" style={{ backgroundImage: `url(${item.album_img_link})` }}>
                {/* <input
                    type="radio"
                    onChange={(event) => this.handleLikeChange(event, item.song_id)}
                    checked={this.state.likeSave}
                    name={item.song_id}
                    id={`like-${item.song_id}`}
                />
                <label htmlFor={`like-${item.song_id}`}>
                    <i></i>
                    <span className="counter">{this.state.likes}</span>
                </label>
                <input
                    type="radio"
                    onChange={(event) => this.handleDislikeChange(event, item.song_id)}
                    checked={this.state.dislikeSave}
                    name={item.song_id}
                    id={`dislike-${item.song_id}`}
                />
                <label htmlFor={`dislike-${item.song_id}`}>
                    <i></i>
                    <span className="counter">{this.state.dislikes}</span>
                </label> */}
            </div>
        );
    }
}

export default LikeDislikeManager;
