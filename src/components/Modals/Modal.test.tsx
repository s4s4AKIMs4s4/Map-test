import React from 'react';
import { render, screen } from '@testing-library/react';
import { IMarker } from '../mapTypes';
import shortid from 'shortid';
import Modal from './Modal'


describe('testing Modal components', () => {
    let paths:Array<IMarker> = []
    
    beforeAll(() =>{
        paths = [
            { lat: 52, lng: 60,description:'point number 1', id:shortid.generate(), yPosition:1, },
            { lat: 40.48578559055679, lng: 30.36653284549709, description:'point number 2', id:shortid.generate(), yPosition:2},
            { lat: 22.48871246221608, lng: 11.44618372440334, description:'point number 3', id:shortid.generate(), yPosition:3 }
            ]
    })

    test('existing Modal itme on document', () => {
        const setVisibleAction = jest.fn()
        for(let i = 0;i < paths.length; i++){
            render(<Modal Visible={true} SetVisible={setVisibleAction} paths = {paths} id = {paths[i].id} />)
            const modalElement = screen.getByText(new RegExp(`${paths[i].description}`))
            expect(modalElement).toBeInTheDocument();
        }
    });
})
