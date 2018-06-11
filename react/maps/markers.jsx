// from https://www.npmjs.com/package/react-esri-map

import React, { Component, PropTypes } from 'react';
import Leaflet from './leaflet/leaflet.js';
import EsriLeaflet from 'esri-leaflet';

export default class Markers extends Component {
    markers = [];
    first = true;
    constructor(props) {
        super(props);
    }
    componentDidMount() {
        this.markers.forEach(marker => {
            this.context.map.removeLayer(marker)
        });
        this.markers = [];
        const myMarkerIcon = L.icon({
            iconUrl: 'images/marker-icon.png',
        });
        const othersMarkerIcon = L.icon({
            iconUrl: 'images/marker-icon2.png',
        });
        this.props.markers.forEach((marker, i) => {
            const currentMarker = L.marker([marker.lat, marker.lng], { icon: marker.markerType == 0 ? myMarkerIcon : othersMarkerIcon, zIndexOffset: marker.markerType == 0 ? -50 : 0 }).addTo(this.context.map);
            if (marker.onClick) currentMarker.on("click", marker.onClick);

            this.markers.push(currentMarker);
            if (i == 0 && this.first && this.props.center) {
                this.first = false;
                this.context.map.panTo(currentMarker.getLatLng())
            }
        })
    }
    componentWillReceiveProps() {
        this.markers.forEach(marker => {
            this.context.map.removeLayer(marker)
        });
        this.markers = [];
        const myMarkerIcon = L.icon({
            iconUrl: 'images/marker-icon.png',
        });
        const othersMarkerIcon = L.icon({
            iconUrl: 'images/marker-icon2.png',
        });
        this.props.markers.forEach((marker, i) => {
            const currentMarker = L.marker([marker.lat, marker.lng], { icon: marker.markerType == 0 ? myMarkerIcon : othersMarkerIcon, zIndexOffset: marker.markerType == 0 ? -50 : 0 }).addTo(this.context.map);
            if (marker.onClick) currentMarker.on("click", marker.onClick);
            this.markers.push(currentMarker);
            if (i == 0 && this.first && this.props.center) {
                this.first = false;
                this.context.map.panTo(currentMarker.getLatLng())
            }
        })
    }

    render() {
        return null;
    }
};

Markers.contextTypes = {
    map: PropTypes.object
};

Markers.propTypes = {
    options: PropTypes.object
};

Markers.defaultProps = {
    options: {}
};
