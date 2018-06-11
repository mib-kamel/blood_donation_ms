// from https://www.npmjs.com/package/react-esri-map

import React, { Component, PropTypes } from 'react';
import Leaflet from './leaflet/leaflet.js';
import EsriLeaflet from 'esri-leaflet';
import Chance from 'chance';

const chance = new Chance();

export default class Map extends Component {

    mapMinZoom = 11;
    mapDefaultZoom = 16;

    state = {
        map: null,
        mapId: chance.hash({ length: 15 })
    }

    componentDidMount() {
        const L = window.L;
        const map = L.map(this.state.mapId);
        if (this.props.onLoad) map.on('load', () => this.props.onLoad(map.getBounds()));
        map.setView([this.props.lat, this.props.lng], this.mapDefaultZoom);

        L.Icon.Default.imagePath = this.props.imagePath;

        // Add event handlers
        if (this.props.onDragStart) {
            map.on('dragstart', this.props.onDragStart);
        }

        if (this.props.onPreDrag) {
            map.on('predrag', this.props.onPreDrag);
        }

        if (this.props.onDrag) {
            map.on('drag', this.props.onDrag);
        }

        if (this.props.onDragEnd) {
            map.on('dragend', () => this.props.onDragEnd(map.getBounds()));
        }

        if (this.props.onMapClick) {
            map.on('click', this.props.onMapClick);
        }

        if (this.props.onZoomed) {
            map.on('zoomend', () => this.props.onZoomed(map.getBounds()));
        }

        if (this.props.onResize) {
            map.on('resize', this.props.onResize);
        }

        map.options.minZoom = this.mapMinZoom;

        this.setState({ map: map });
    }

    getChildContext() {
        return {
            map: this.state.map
        }
    }

    getBounds() {
        return this.state.map.getBounds()
    }

    render() {
        const { map, mapId } = this.state;
        return (
            <div id={mapId} className="react-esri-map">
                {map && this.props.children}
            </div>
        );
    }
}

Map.propTypes = {
    imagePath: PropTypes.string,
    lat: PropTypes.number,
    lng: PropTypes.number,
    onDrag: PropTypes.func,
    onDragEnd: PropTypes.func,
    onDragStart: PropTypes.func,
    onPreDrag: PropTypes.func,
    zoom: PropTypes.number
};

Map.defaultProps = {
    imagePath: 'https://cdn.socialradar.com/icons/leaflet',
    lat: 38.9043478,
    lng: -77.0429411,
    zoom: 13
};

Map.childContextTypes = {
    map: PropTypes.object
};
