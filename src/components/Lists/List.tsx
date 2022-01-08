import React from 'react'
import { CloseOutlined } from '@ant-design/icons'
import { IMarker } from '../mapTypes'
import ListSyle from '../../css/ListSyle.module.css'

interface IProps{
    paths:Array<IMarker>,
    dispetcherDown: Function,
}

const List =(props:IProps) => {
    const generateList = () => {
        return (props.paths.map((path) => {
          if(path.lat !== 0)
            return <li key = {path.id} className= {ListSyle.MapSection__listItems} onMouseDown={props.dispetcherDown(path)} >           
                {path.description}
                <span className={ListSyle.MapSection__closeIcon}><CloseOutlined/></span>
            </li>
          else 
            return <li key = {path.id} className={ListSyle.MapSection__listItems_hidden} onMouseDown={props.dispetcherDown(path)} ></li>  
        })
      )}

    return (
        <ul className = "MapSection__listNode">     
            {generateList()}
        </ul>
    )
}



export default List
