<script lang="tsx">
import {defineComponent, ref, Ref} from 'vue';
import {MapInfo} from '@/types';
import GoogleMap from './components/google-map/index.vue';
import MapControl from './components/map-control/index.vue';

export default defineComponent({
  name: 'map',
  setup() {
    const list: Ref = ref<[] | MapInfo>([]);
    const mapPos: Ref = ref<{} | MapInfo>({});
    const mapControl = ref<InstanceType<typeof MapControl> & any>();
    const mapGeoJSON = ref({});
    return {
      list,
      mapPos,
      mapControl,
      mapGeoJSON
    };
  },
  render() {
    return (
        <div id="map-container">
          <div class="map">
            <GoogleMap mapList={this.list}
                       mapGeoJSON={this.mapGeoJSON}
                       mapPos={this.mapPos}
                       onClearPos={() => {
                         this.mapControl.clearMapList();
                       }}></GoogleMap>
          </div>
          <div class="control">
            <MapControl ref="mapControl"
                        onMapPosInfo={(list) => {
                          this.list = list;
                        }}
                        onSetMapPos={(pos) => {
                          this.mapPos = pos;
                        }}
                        onSetMapGeoJSON={(json) => {
                          this.mapGeoJSON = json;
                        }}></MapControl>
          </div>
        </div>
    );
  }
});
</script>

<style scoped lang="scss">
#map-container {
  width: 100%;
  height: 100%;
  display: flex;
  min-width: 800px;

  .map {
    flex: 1;
  }

  .control {
    width: 400px;
    height: 100%;
  }
}
</style>
