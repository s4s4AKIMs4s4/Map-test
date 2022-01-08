import React, { useEffect, useRef, useState } from "react";
import { InputMapValue } from "../components/InputMapValue";
import MyMapComponent from '../components/MapComponent'
import {IMarker} from '../components/mapTypes'
import '../css/App.css'
import  '../css/MapPageStyle.css'
import shortid from 'shortid';
import List from '../components/Lists/List'


function MapPage() {

  const liRef = useRef<HTMLLIElement>({} as HTMLLIElement);
  const [isMove,setIsmove] = useState(false)
  const [starPosition,setStartPosition] = useState(0)
  const [id ,setId] = useState<string>('')
  const [position, setPosition] = useState<number>(0)

  const [paths, setPath] = useState<Array<IMarker>>([
    { lat: 52, lng: 60,description:'point number 1', id:shortid.generate(), yPosition:1, },
    { lat: 40.48578559055679, lng: 30.36653284549709, description:'point number 2', id:shortid.generate(), yPosition:2},
    { lat: 22.48871246221608, lng: 11.44618372440334, description:'point number 3', id:shortid.generate(), yPosition:3 },
    { lat: 11.48871246221608, lng: 9.44618372440334, description:'point number 4', id:shortid.generate(), yPosition:3 }
  ]);

  const updateSize = () => {
    const listElement = document.getElementsByClassName('MapSection__listNode')[0]
    const positionArray = Array.from(listElement.children).map((val) => {
      return val.getBoundingClientRect().y
    })

    paths.forEach((path, index) => {
      if(index < positionArray.length)
        path.yPosition = positionArray[index]
    })
  }

  useEffect(() => {
    updateSize()
  }, [paths])

  const deleteLiItem = (liObj:IMarker) => {
    let newPaths = [...paths]
    for(let i = 0; i < paths.length; i++){
      if(paths[i].id === liObj.id){
        newPaths.splice(i,1)
        setPath(newPaths)
        break;
      }
    }
  }

  const dispetcherDown = (liObj:IMarker) => (e:React.MouseEvent<HTMLLIElement>) => {
    if((e.target as HTMLElement).tagName === 'path' || (e.target as HTMLElement).tagName === 'svg'){
      deleteLiItem(liObj)
    }
    setIsmove(true)
    setStartPosition(e.clientY)
    setId(liObj.id)
    liRef.current = e.currentTarget
    liRef.current.style.position = 'relative'
  }

  const dispetcherOut = (e:React.MouseEvent) => {
    if(isMove){
      setIsmove(false)
      const bpaths = paths.filter((path) => path.lat !== 0)
      const newPath:IMarker[] = bpaths.map((path) => {
        if(path.id !== id)
          return {...path, id:shortid.generate(), yPosition: path.yPosition }
        else{
          return {...path,id:shortid.generate(), yPosition:position}
        }
      })
      setPath(newPath.sort((path1, path2) => path1.yPosition - path2.yPosition ))
    }
  }

  const translateLiItem = (e:React.MouseEvent) => {
    if(starPosition < e.clientY){
      const diff = Math.abs(starPosition - (e.clientY))
      liRef.current.style.top = `${String (diff)}px`
     }
     else{
      const diff = Math.abs((e.clientY) - starPosition)
      liRef.current.style.top = `${String (-diff)}px`
     }
  }

  const deleteTwoEmptyObject = (newstate:Array<IMarker>) => {
    let f = false
    let oneSpaceArray:Array<IMarker> = []
    for(let i =0; i < newstate.length ;i++) {
      if(newstate[i].lat === 0 && f === false){
        f = true
        oneSpaceArray.push(newstate[i])
      }
      if(newstate[i].lat === 0 && f === true){
        continue
      }
      oneSpaceArray.push(newstate[i])
    }
    return oneSpaceArray
  }

  const setRigthPosition = (e:React.MouseEvent) => {
    const newstate:Array<IMarker>= []
    const emptyObj:IMarker = { lat: 0, lng:0, description :"", id:shortid.generate(), yPosition:2}

     for(let i = 0; i < paths.length ; i++){
       if(id === paths[i].id && i === 1){
           newstate.push(paths[i])
           continue
         }
         if(i === paths.length - 1){
           if(e.clientY > paths[i].yPosition){
             newstate.push(paths[i])
             newstate.push(emptyObj)
             continue
           }
         }
         else if( paths[i].yPosition < e.clientY && e.clientY < paths[i+1].yPosition ){ 
           newstate.push(paths[i])
           newstate.push(emptyObj)
           continue
         }
       if(paths[i].lat === 0) continue
       newstate.push(paths[i])
     }
     return newstate
  }

  const dispetcherMove = (e:React.MouseEvent) => {
    if(isMove){
      translateLiItem(e)
      setPosition(e.clientY)
      const newstate = setRigthPosition(e)
      setPath(deleteTwoEmptyObject(newstate))
    }
  }

  return (
    <div className = "App" onMouseUp={dispetcherOut}>
      <div className = "MapSection" >

        <div className = "MapSection__logic" onMouseMove={dispetcherMove}>
          <div className = "MapSection__input">
            <InputMapValue paths = {paths} setPaths={setPath}/>
          </div>  

          <div className = "MapSection__list">
            <List paths={paths} dispetcherDown={dispetcherDown}/>
          </div>
        </div>
        
        <div className="MapSection__View">
          <MyMapComponent  
            paths = {paths}
            setPath = {setPath}
            googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyCEA48qllJgryMgWhCnXmUOKVQssZBX-kQ&libraries=geometry,drawing,places"
            loadingElement={<div style={{ height: `100%` }} />}
            containerElement={<div style={{ height: `100%` }} />}
            mapElement={<div style={{ height: `100%` }} />}
          />
        </div>
      </div>
    </div>
  );
}

export default MapPage;
