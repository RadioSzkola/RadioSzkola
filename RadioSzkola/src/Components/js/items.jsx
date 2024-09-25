import { useState, useEffect, useCallback, useRef } from 'react';
import PropTypes from 'prop-types';
// import ProgressBar from './progressBar.jsx';
import LikeDislikeManager from './api.jsx';

const minsToTime = (duration) => {
    let seconds = Math.round(duration * 60);
    let minutes = 0;
    let equal = '';

    while (seconds >= 60) {
        minutes += 1;
        seconds -= 60;
    }

    if (minutes === 0 && seconds === 0) {
        equal = '0 minut(y)';
    } else if (minutes === 1 && seconds === 1) {
        equal = `${minutes} minuta i ${seconds} sekunda`;
    } else if (minutes === 1) {
        equal = `${minutes} minuta${seconds > 0 ? ' i ' + seconds + ' sekund(y)' : ''}`;
    } else if (seconds === 1) {
        equal = `${minutes} minut(y) i ${seconds} sekunda`;
    } else if (seconds === 0) {
        equal = `${minutes} minut(y)`;
    } else {
        equal = `${minutes} minut(y) i ${seconds} sekund(y)`;
    }

    return equal;
}


const Item = ({ item: initialItem, elements, refresh }) => {
    const [likes, setLikes] = useState(initialItem.likes);
    const [dislikes, setDislikes] = useState(initialItem.dislikes);
    const itemRef = useRef(initialItem)

    const refreshData = useCallback(() => {
        const element = refresh.find((el) => el.song_id === itemRef.current.song_id);
        if (element) {
            setLikes(element.likes);
            setDislikes(element.dislikes);
            itemRef.current = element;
        }
    }, [refresh])

    useEffect(() => {
        refreshData();
    }, [refresh, refreshData])

    let likePercent;
    if (likes === 0 && dislikes === 0) {
        likePercent = 50;
    } else {
        likePercent = (likes / (likes + dislikes)) * 100;
    }

    if (isNaN(likePercent)) {
        likePercent = 50;
    }

    return (
        <div className="PlaylistSectionItem">
            <LikeDislikeManager item={itemRef.current} elements={elements} refresh={refresh} />
            <div className="PlaylistSectionItemInfo" data-info>
                <a target="_blank" href={itemRef.current.track_link} data-title>{itemRef.current.name}</a>
                <a target="_blank" href={itemRef.current.artist_link} data-artist>{itemRef.current.artist}</a>
                <a target="_blank" href={itemRef.current.album_link} data-album>{itemRef.current.album}</a>
                <p target="_blank" data-duration>Długość: {minsToTime(itemRef.current.duration_in_mins)}</p>
                {/* <p target="_blank" data-popularity-desc>Popularność: {Math.round(likePercent) + "%"}</p> */}
                {/* <ProgressBar item={item} refresh={refresh} /> */}
            </div>
        </div>
    )
}

Item.propTypes = {
    item: PropTypes.object,
    elements: PropTypes.array,
    refresh: PropTypes.array
}

export default Item;