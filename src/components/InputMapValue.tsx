import React, { useState } from 'react'
import {IMarker} from '../components/mapTypes'
import { Input } from 'antd';
import { Form, Button } from 'antd';
import shortid from 'shortid';

interface Props {
    paths: IMarker[];
    setPaths: Function;
}

interface IFormValues{
  lat:string,
  lng:string,
  description:string
}

export const InputMapValue = (props: Props) => {
  const [error, setError] = useState<string>('')
    const onFinish = (values: IFormValues) => {
      try{
        console.log(values)
        const lat = Number(values.lat)
        const lng = Number(values.lng)
        const description = values.description.trim()
        if(!description) throw new Error("description must be a string value");
        if(!lat || !lng) throw new Error("lat and lng must be a string value");
        setError('')
        const newValue = {
            lat:lat,
            lng:lng,
            id:shortid.generate(),
            description:description,
            yPosition:2000,
        }
        const newPaths = [...props.paths, newValue]
        props.setPaths(newPaths)
      }
      catch(e:any){
        setError(e.message)
      }

      };
    
      const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
      };

    return (
        <Form className='Form'
      name="basic"
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      initialValues={{ remember: true }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
    >
      <Form.Item
        label="lat"
        name="lat"
        rules={[{ required: true, message: 'Please input your username!' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="lng"
        name="lng"
        rules={[{ required: true, message: 'Please input your password!' }]}
      >
        <Input/>
      </Form.Item>
      

      <Form.Item
        label="description"
        name="description"
        rules={[{message: 'Please input your password!' }]}
      >
        <Input/>
        
      </Form.Item>
      {error && <span>{error}</span>}
      <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
        <Button type="primary" htmlType="submit">
          Add
        </Button>
      </Form.Item>
    </Form>
            
        
    )
}
