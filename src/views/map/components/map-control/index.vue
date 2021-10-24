<script lang="tsx">
import {defineComponent, ref, Ref} from 'vue';
import {MapInfo} from '@/types';
import {read} from 'shapefile';

const CN_LAT_LNG_RANGE = {
  lat: {
    min: 4,
    max: 53.5
  },
  lng: {
    min: 73.5,
    max: 135
  }
};

export default defineComponent({
  name: 'map-control',
  emits: ['mapPosInfo', 'setMapPos', 'setMapGeoJSON'],
  setup(props, content) {
    let mapList: Ref = ref<[] | MapInfo>([]);
    const genPos = (min: number, max: number): number => {
      return Number((Math.random() * (max - min) + min).toFixed(4));
    };
    const genMapList = () => {
      let m: MapInfo[] = [];
      for (let id = 1; id <= 5000; id++) {
        m.push({
          id,
          lat: genPos(CN_LAT_LNG_RANGE.lat.min, CN_LAT_LNG_RANGE.lat.max),
          lng: genPos(CN_LAT_LNG_RANGE.lng.min, CN_LAT_LNG_RANGE.lng.max)
        });
      }
      mapList.value = m;
    };
    const clearMapList = () => {
      mapList.value = [];
    };
    // shapeFile to geoJSON
    const shapeFileToGeoJson = (file: Blob) => {
      const reader = new FileReader();
      reader.onload = async function(e: any) {
        // const target = e.target as HTMLInputElement | Event;
        const arrayBuffer = e.target.result;
        read(arrayBuffer).then(res => {
          content.emit('setMapGeoJSON', res);
        });
      };
      reader.readAsArrayBuffer(file);
    };

    return {
      genMapList,
      mapList,
      clearMapList,
      shapeFileToGeoJson,
    };
  },
  render() {
    return (
        <div id="map-control-container">
          <div class="button-wrap">
            <button onClick={() => {
              this.genMapList();
              this.$emit('mapPosInfo', this.mapList);
            }}>generate
            </button>
            <input type="file" onChange={(file: any) => {
              this.shapeFileToGeoJson(file.target.files[0]);
            }}/>
          </div>
          <div class="pos-list">
            {this.mapList?.map((i: MapInfo) => {
              return (
                  <div class="pos-list__item" onClick={() => {
                    this.$emit('setMapPos', i);
                  }}>
                    <span>ID:{i.id}</span>
                    <span>经度:{i.lng}</span>
                    <span>维度:{i.lat}</span>
                  </div>
              );
            })}
          </div>
        </div>
    );
  }
});
</script>

<style scoped lang="scss">
#map-control-container {
  height: 100%;
  display: flex;
  flex-direction: column;

  .button-wrap {
    margin-bottom: 10px;

    button {
      margin-right: 20px;
    }
  }

  .pos-list {
    width: 100%;
    flex: 1;
    overflow: auto;

    &__item {
      display: flex;
      align-items: center;
      justify-content: space-around;
      height: 40px;
      border: 1px solid floralwhite;
      cursor: pointer;
    }
  }
}
</style>
