<script lang="tsx">
import {defineComponent, watch, toRefs} from 'vue';
import {Loader} from '@googlemaps/js-api-loader';

const CD_LAT_LNG = {
  lat: 30.67,
  lng: 104.06,
};

export default defineComponent({
  name: 'google-map',
  props: {
    mapList: {
      type: Array,
      default: () => {
      }
    },
    mapPos: {
      type: Object,
      default: () => {
      }
    },
    mapGeoJSON: {
      type: Object,
      default: () => {
      }
    }
  },
  emits: ['clearPos'],
  setup(props, context) {
    const {mapList, mapPos, mapGeoJSON} = toRefs(props);
    let map: null | any, googleMap = null;
    navigator.geolocation.getCurrentPosition((pos) => {
      console.log(pos);
    });
    const loader = new Loader({
      apiKey: '',
      version: 'weekly',
      libraries: ['places']
    });

    loader
        .load()
        .then((google) => {
          googleMap = google;
          map = new google.maps.Map(document.getElementById('google-map-container'), {zoom: 6});
          map.setCenter(CD_LAT_LNG);
          let markersArray: any[] = [];
          // 生成 marker
          watch(mapList, (n) => {
            n?.forEach((i: any) => {
              const marker = new google.maps.Marker({
                position: {lat: i.lat, lng: i.lng},
                map
              });
              markersArray.push(marker);
            });
          });
          watch(mapPos, (n) => {
            map.setCenter({
              lat: n.lat,
              lng: n.lng
            });
          });
          watch(mapGeoJSON, (n) => {
            map.data.addGeoJson(n);
          });
          const clearMarkers = () => {
            for (let i = 0; i < markersArray.length; i++) {
              markersArray[i].setMap(null);
            }
          };
          // 生成路径
          const genMapPath = (color: string) => {
            const linePos = mapList.value.map((i: any) => {
              return {
                lat: i.lat,
                lng: i.lng
              };
            });
            const bermudaTriangle = new google.maps.Polygon({
              paths: linePos,
              strokeColor: '#9334e6',
              strokeOpacity: 0.8,
              strokeWeight: 2,
              fillColor: color,
              fillOpacity: 1,
            });
            bermudaTriangle.setMap(map);
          };
          // 鼠标右键操作
          google.maps.event.addDomListener(map, 'rightclick', () => {
            genMapPath('#9334e6');
            clearMarkers();
            context.emit('clearPos');
          });
          const fillColorControl = (controlDiv: Element, map: any) => {
            const controlUI = document.createElement('div');
            controlUI.style.backgroundColor = '#fff';
            controlUI.style.border = '2px solid #fff';
            controlUI.style.borderRadius = '3px';
            controlUI.style.boxShadow = '0 2px 6px rgba(0,0,0,.3)';
            controlUI.style.cursor = 'pointer';
            controlUI.style.marginTop = '8px';
            controlUI.style.marginBottom = '22px';
            controlUI.style.textAlign = 'center';
            controlDiv.appendChild(controlUI);
            const controlText = document.createElement('div');
            controlText.style.color = 'rgb(25,25,25)';
            controlText.style.fontFamily = 'Roboto,Arial,sans-serif';
            controlText.style.fontSize = '16px';
            controlText.style.lineHeight = '38px';
            controlText.style.paddingLeft = '5px';
            controlText.style.paddingRight = '5px';
            controlText.innerHTML = 'fill color';
            controlUI.appendChild(controlText);
            controlUI.addEventListener('click', () => {
              genMapPath('#FF0000');
            });
          }
          const fillColorControlDiv = document.createElement('div');
          fillColorControl(fillColorControlDiv, map);
          map.controls[google.maps.ControlPosition.TOP_CENTER].push(fillColorControlDiv);
        });
    return {};
  },
  render() {
    return (
        <div id="google-map-container"></div>
    );
  }
});
</script>

<style scoped lang="scss">
#google-map-container {
  width: 100%;
  height: 100%;
}
</style>
