import styled from 'styled-components'
import { Link as LinkR } from 'react-router-dom'

export const PicturesCategory = styled.div `
  display: flex;
  flex-direction: row;
  column-gap: 3vw;
  justify-content: space-between;
  height: 60px;
  z-index: 1;
  width: 100%;
  padding: 20px 3vw 0 5vw;
  max-width: 1000px;
  @media screen and (max-width: 768px) {
    flex-direction: column;
  }
`

export const Picture = styled.img `
  width: 28vw;
  height: 24vw;
  padding-top: 45px;
  text-align: center;
  @media screen and (max-width: 768px) {
    width: 80vw;
    height: auto;
    
  }
`
export const Picturetitle = styled.h2 `
  color: #404040;
  text-align: center;
  font-size: 28px;
  padding-top: 8px;
  font-weight: 600;
`
export const Categorytitle = styled.h1 `
  color: #D3D3D3;
  text-align: center;
  font-size: 100px;
  padding-top: 5vw;
`
export const PictureAndTitle = styled.div `
  text-align: center;
`
export const Category = styled.div `
  min-height: 700px;
  @media screen and (max-width: 768px) {
    margin-top: 1150px;
  }
`