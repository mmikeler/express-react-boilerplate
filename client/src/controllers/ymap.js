import { useEffect, useState, useRef } from "react";
import { YMaps, Map, SearchControl, Placemark } from "react-yandex-maps";

const mapState = { center: [59.220501, 39.891525], zoom: 12 };

export function Ymap(){
  const [ymaps, setYmaps] = useState(null);
  const [text, setText] = useState(null);
  const [bounds, setBounds] = useState(null);
  const routes = useRef();
  const mapRef = useRef(null);
  const searchRef = useRef(null);

  useEffect(() => {
    // console.log(searchRef);
    if (text && searchRef.current) {
      searchRef.current.search(text);
    }
  }, [text]);

  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.setBounds(bounds);
      // console.log(bounds);
    }
  }, [bounds]);

  const getRoute = (ref) => {
    if (ymaps) {
      const multiRoute = new ymaps.multiRouter.MultiRoute(
        {
          // Описание опорных точек мультимаршрута.
          referencePoints: [[55.734876, 37.59308], "Москва, ул. Мясницкая"],
          // Параметры маршрутизации.
          params: {
            // Ограничение на максимальное количество маршрутов, возвращаемое маршрутизатором.
            results: 2
          }
        },
        {
          // Автоматически устанавливать границы карты так, чтобы маршрут был виден целиком.
          boundsAutoApply: true,
          // Внешний вид линии маршрута.
          routeActiveStrokeWidth: 6,
          routeActiveStrokeColor: "#fa6600"
        }
      );

      routes.current = multiRoute;
      ref.geoObjects.add(multiRoute);
    }
  };

  const getRoutes = () => {
    ymaps.route([ [59.220501, 39.891525], [59.196182, 39.907133]]
    ).then(
      function (route) {
        var distance = route.getHumanLength(); //Получаем расстояние
        alert(distance.replace(' ', ' '));
        ymaps.geoObjects.add(route); //Рисуем маршрут на карте
      },
      function (error) {
          console.log(error.message);
      }
    );
  };

  return(
    <YMaps version="2.1.77">
        <Map
          width="50%"
          modules={[
            "multiRouter.MultiRoute",
            "coordSystem.geo",
            "geocode",
            "util.bounds",
            "route"
          ]}
          onLoad={(ymaps) => {
            setYmaps(ymaps);
            const points = [
              [59.220501, 39.891525],
              [59.196182, 39.907133]
            ];
            setBounds(ymaps.util.bounds.fromPoints(points));
          }}
          state={mapState}
          instanceRef={(ref) => {
            if (ref) {
              // setTimeout(() => console.log(ref.geoObjects.getBounds()), 100);
              mapRef.current = ref;
              // ref.setBounds(bounds);
            }
          }}
          // instanceRef={ref => ref && getRoute(ref)}
        >
          <SearchControl
            instanceRef={(ref) => {
              if (ref) searchRef.current = ref;
            }}
            options={{
              float: "right",
              provider: "yandex#search",
              size: "large"
            }}
          />
        </Map>
        <button onClick={getRoutes}>Show route</button>
      </YMaps>
  )
}