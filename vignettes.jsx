import React from 'react';
import axios from 'axios';
import Label from 'react-bootstrap/lib/Label'
import Grid from 'react-bootstrap/lib/Grid'
import Row from 'react-bootstrap/lib/Row'
import Col from 'react-bootstrap/lib/Col'
import Image from 'react-bootstrap/lib/Image'

class Vignettes extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      listeVignettes : []
    }
    this.onDetailClick = this.onDetailClick.bind(this);
  }

  onDetailClick(index) {
    console.log("boum on a clique sur "+index)
    console.log("on va donc sur le domaine " +this.state.listeVignettes[index].ORIGIN)
    this.setState({rowHeight : 350})
    console.log(this.state.listeVignettes[index].ORIGIN)
    let dataResponse = []

    axios.get('http://127.0.0.1:6544/alerting-core/origin/'+this.state.listeVignettes[index].ORIGIN )
    .then( function (response) {
      this.setState ( {dataRow : response.data  } )
      this.transformerCol(this.state.dataRow[0])

      console.log("hauteur" + this.state.rowHeight)
      this.sizeToFit()
      this.state.dataCol.ID.width =30;

        }.bind(this))
        .catch(function (response){
            console.log(response)
          }) 
  }

    componentDidMount() {
    let dataResponse = []

    axios.get('http://127.0.0.1:6544/alerting-core/vignettes' )
    .then( function (response) {
        this.setState ( {listeVignettes : response.data  } )
    }.bind(this))
    .catch(function (response){
        console.log(response)
      }) 
    }

  render() {
    return (
      <Grid fluid={true}>
        <Row>
        {

          this.state.listeVignettes.map( function(listval,i)
          {
            var clickIndex = this.onDetailClick.bind(this,i)
            return (
                <Col key={i} onClick={clickIndex} xs={12} sm={6} md={4} lg={3} >
                 <Image src="./assets/thumbnail.png" rounded />
                  <h3>{listval.ORIGIN} <Label bsStyle="danger"> {listval.NB_ERREUR} </Label> </h3>
                </Col>     
              );
          }.bind(this) )
        }
        </Row>
      </Grid>
    );
  }

}



export default Vignettes;