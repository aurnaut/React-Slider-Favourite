import React, { Component } from 'react';
import axios from 'axios';
import Slider from "react-slick";
import "./slick.css";
import './card.css';
import SVGSprite from './images/sprite.svg';

const apiEndpoint = 'http://localhost:3001/cards';

class Card extends Component {
  constructor(props) {
    super(props);
    this.next = this.next.bind(this);
    this.updateCards = this.updateCards.bind(this);
    this.handleLink = this.handleLink.bind(this);
    this.previous = this.previous.bind(this);
    this.state = { cards: [] };
  }

  next() {
    this.slider.slickNext();
  }
  previous() {
    this.slider.slickPrev();
  }


  componentDidMount = async () => {
    await this.getCards()
    this.updateCards()
  }


  getCards = async () => {
    try {
      const response = await axios.get(apiEndpoint)
      this.setState({
          cards: response.data
      })
    } catch (err) {
        console.log(err)
    }
  }

updateCards = async (event) => {
  event.stopPropagation();
    try {
      await axios.patch("http://localhost:3001/cards/" + event.currentTarget.id, {is_liked: !(this.state.cards.map(card => card.is_liked))[event.currentTarget.id - 1]})
      await this.getCards()
    } catch (err) {
      console.log(err)
    }
  }

  handleLink = async (event) => {
    event.stopPropagation();
    let urlLink = this.state.cards.map(card => card.href)[event.currentTarget.id - 1];
    window.location.assign(urlLink);
  }

  render() {
    var settings = {
      dots: false,
      infinite: true,
      arrows: false,
      speed: 500,
      slidesToShow: 3,
      slidesToScroll: 3,
      responsive: [
        {
          breakpoint: 1024,
          settings: {
            slidesToShow: 3,
            slidesToScroll: 3,
            infinite: true,
            dots: false
          }
        },
        {
          breakpoint: 768,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 2,
            initialSlide: 2
          }
        },
        {
          breakpoint: 550,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1
          }
        }
      ]
    };
    return (
      <div className="App">
          <Slider className="slider" ref={c => (this.slider = c)} {...settings}>
          
            {this.state.cards.map(card => {
                  return (
                    <a id={card.id} onClick={this.handleLink} className="slider-card" key={card.id}>
                        <span><img src={card.image_url}></img></span>
                        <div className="slider-content-wrap">
                          <svg className="svg-mindera-avatar"><use href={SVGSprite + "#mindera-avatar"}></use></svg>
                          <div className="title-subtitle-wrap">
                            <span className="slide-title">{card.title}</span>
                            { card.subtitle ? <span className="slide-subtitle"> { card.subtitle } </span> : '' }
                          </div>
                          <span className="slide-description" dangerouslySetInnerHTML={{ __html: card.text }}></span>
                          <span>{ card.is_liked ? <svg className="full-heart-icon"><use id={card.id} onClick={ this.updateCards } href={SVGSprite + "#full-heart"}></use></svg> : <svg id={card.id} onClick={this.updateCards} className="outline-heart-icon"><use href={SVGSprite + "#outline-heart"}></use></svg> }</span>
                        </div>
                    </a>
                  );
                })}
          </Slider>
          <div className="slider-controls">
            <span className="button" onClick={this.previous}>
              <svg className="control-left"><use href={SVGSprite + "#control-left"}></use></svg>
            </span>
            <span className="button" onClick={this.next}>
            <svg className="control-left"><use href={SVGSprite + "#control-right"}></use></svg>
            </span>
          </div>
      </div>
    );
  }
}


export default Card;
