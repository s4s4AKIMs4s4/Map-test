import React from 'react'
import { Modal } from 'antd';
import { IMarker } from '../mapTypes';

interface IProps{
    Visible:boolean,
    SetVisible:Function
    id:string,
    paths:Array<IMarker>
}

const ModalMarger = (props: IProps) => {

    const handleOkModal = () =>{
        props.SetVisible(false)
    }

    const getMakerData = () => {
        let item:IMarker = {}  as IMarker
        for(let i = 0 ;i < props.paths.length; i++){
            if(props.id === props.paths[i].id){
                item = props.paths[i]
                break;
            }
        }

        return(<div> 
                <p>description: {item.description}</p>
                <p>lat: {item.lat}</p>
                <p>lng: {item.lng}</p>
            </div>)
    }

    return (     
        <Modal title="information modal" visible={props.Visible} onOk={handleOkModal} onCancel={handleOkModal}>
            { getMakerData() }
        </Modal>
    )
}

export default React.memo(ModalMarger)
