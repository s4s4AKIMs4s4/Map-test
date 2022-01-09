import React, {useEffect, useRef, useState } from "react"
import { GoogleMap, Marker,Polyline,InfoWindow  } from "react-google-maps"
import withGoogleMap from "react-google-maps/lib/withGoogleMap"
import withScriptjs from "react-google-maps/lib/withScriptjs"
import {IMarker,IPoligonPaths} from '../components/mapTypes'
import shortid from 'shortid';
import Modal from "./Modals/Modal"
import MapStyle from "../css/Map.module.css"
interface IProps{
  paths:IMarker[],
  setPath:Function, 
}

const MyMapComponent =withScriptjs(withGoogleMap((props:IProps) =>
{
  const [poligonPaths, setPoligonPaths] = useState<IPoligonPaths[]>({} as IMarker[])
  const [currentId, setCurrentId] = useState<string>('')
  const [visibleAction, setVisibleAction] = useState<boolean>(false)
  const [intermediatePoint, setIntermediatePoint] = useState<number>(1)

  useEffect(() => {
    setPoligonPaths( props.paths.map((pat) => {
        return {lat:pat.lat, lng:pat.lng}
      }) 
    )
  }, [props.paths])

  const polygonRef:any = useRef(null);

  const handlePolilineUserAction = (nextPath:any) => {
    if(nextPath.length === props.paths.length){
      props.setPath(nextPath.map((value:any, index:any) => {
        return {...value,description:props.paths[index].description  }
      })
      )
    }
    else{
      setIntermediatePoint(prev => prev+1)
      for(let i = 0; i< props.paths.length ; i++){
        if( (props.paths[i].lat !== nextPath[i].lat) || (props.paths[i].lng !== nextPath[i].lng) ){
          nextPath[i].description = `intermediate point ${intermediatePoint}`
          for(let k = i+1; k <= props.paths.length; k++){
            nextPath[k].description = props.paths[i].description
            i++ 
          }
          props.setPath(nextPath);
          break
        }
        nextPath[i].description = props.paths[i].description
      }
    }
  }

  const onEdit = () => {
    if (polygonRef.current) {
      const nextPath = polygonRef.current
        .getPath()
        .getArray()
        .map((latLng:any) => {
          return { lat: latLng.lat(), lng: latLng.lng(), id:shortid.generate(), yPosition:1  };
        });
        handlePolilineUserAction(nextPath)
    }
    
  }
  const clickMarketHandler = (e:React.MouseEvent<HTMLSpanElement>) => {
    setVisibleAction(true)
    setCurrentId(e.currentTarget.dataset.id as string)
  }
  
  const renderingSpan = () => {
    return (      
        props.paths.map( p => {
        if(p.lat === 0) return
        return <InfoWindow position = {p} >
                <span data-id ={p.id} className={MapStyle.MapSection__marker} onClick = {clickMarketHandler} > {p.description} </span>
              </InfoWindow>
        })
    )
  }

  return(
    <div>
      { renderingSpan() }  

      <GoogleMap
        defaultZoom={4}
        defaultCenter={{ lat: 52.52549080781086, lng: 13.398118538856465 }}
      >
        <Polyline
                ref={polygonRef}
                path={poligonPaths}
                draggable = {true}
                editable = {true}
                onMouseUp = {onEdit}
                onDragEnd = {onEdit}
                options={{
                    strokeColor: "#ff2527",
                    strokeOpacity: 1,
                    strokeWeight: 3,
                    
                    icons: [
                        {
                            icon: Marker,
                            offset: "0",
                            repeat: "20px"
                        }
                    ]
                }}
            />
      </GoogleMap>    
      <Modal Visible={visibleAction} SetVisible={setVisibleAction} paths = {props.paths} id = {currentId} />    
    </div>
  )
 
}))

export default React.memo(MyMapComponent)

