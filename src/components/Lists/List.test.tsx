import React from 'react';
import { render, screen } from '@testing-library/react';
import LIst from './List';
import { IMarker } from '../mapTypes';
import shortid from 'shortid';



describe('testing List components', () => {
    let paths:Array<IMarker> = []
    
    beforeAll(() =>{
        paths = [
            { lat: 52, lng: 60,description:'point number 1', id:shortid.generate(), yPosition:1, },
            { lat: 40.48578559055679, lng: 30.36653284549709, description:'point number 2', id:shortid.generate(), yPosition:2},
            { lat: 22.48871246221608, lng: 11.44618372440334, description:'point number 3', id:shortid.generate(), yPosition:3 }
            ]
    })

    test('existing lis itmes on document', () => {
      const dispetcherDown = jest.fn()

      render(<LIst dispetcherDown = {dispetcherDown} paths = {paths} />);
      for(let i =  0; i < paths.length; i++ ){
        const linkElement = screen.getByText(`${paths[i].description}`);
        expect(linkElement).toBeInTheDocument();
      }
      
    });


})
