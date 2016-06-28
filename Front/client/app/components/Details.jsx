var React = require('react');

require("!style!css!less!../assets/detail.less");

import {AgGridReact} from 'ag-grid-react';
import axios from 'axios';
import Col from 'react-bootstrap/lib/Col'

	function StringifyData(parametreastringifier, nomdata)
	{
		if(parametreastringifier==null)
			return("La donnée "+nomdata+" N'est pas renseignée pour cette alerte.")
		else
			return(parametreastringifier+"")
	}


export default class Details extends React.Component{

	constructor(props) {
		super(props);
    this.onDetailClick = this.onDetailClick.bind(this);
		this.state = {
			dataRow : []
		}
	}

	onDetailClick(index) {

		switch(index) {

		case 0: 
			axios.get('http://localhost:6588/alerting-core/delete/'+this.props.routeParams.id)
					.then( function (response) {
					alert("Alert was properly deleted");
				this.setState ( {Rep_call : response.data  } )
			})
			.catch(function (response){
					console.log(response);})
		break;
		case 1:
			axios.get('http://localhost:6588/alerting-core/ignore/'+this.props.routeParams.id)
					.then( function (response) {
					alert("Alerte was ignored");
				this.setState ( {Rep_call : response.data  } )
			})
			.catch(function (response){
					console.log(response);})
		break;
		case 2:
			axios.get('http://localhost:6588/alerting-core/treat/'+this.props.routeParams.id)
				.then( function (response) {
				alert("Alert was treated");
				this.setState ( {Rep_call : response.data  } )
			})
			.catch(function (response){
					console.log(response);})
		break;
		case 3:
			axios.get('http://localhost:6588/alerting-core/putonhold/'+this.props.routeParams.id)
				.then( function (response) {
				alert("Alert was put on hold");
				this.setState ( {Rep_call : response.data  } )
			})
			.catch(function (response){
					console.log(response);})
		break;

  }
  location.reload();
}

	componentDidMount() {

		let dataResponse = []
		axios.get('http://localhost:6588/alerting-core/infos/'+this.props.routeParams.id )
			.then( function (response) {
				this.setState ( {dataRow : response.data  } )
			}.bind(this))
			.catch(function (response){
					console.log(response);
				})
	}

//Faire la jointuire pour obtenir type

	render () {
		
		
		function classString(detaildata, nomdata)
		{
			if(nomdata === "lvl")
			{
				var locClassString;
				if (detaildata === null)
				{
					locClassString = "row titleLine "+nomdata+0;
				}
				else
				{
					locClassString = "row titleLine "+nomdata+detaildata;
				}
			}
			else
			{
				if(detaildata === null)
				{
					locClassString = "row noData";
				}
				else
				{
					locClassString = "row "+nomdata;
				}
			}
			return locClassString
		}
		console.log(this.state.dataRow) ;
		if (this.state.dataRow.ID != null) {
		return (
				<div className="detail">
					<div className="row">
						<div className="col-lg-12">
							<span className="numero">N° {this.state.dataRow.ID}</span>
						</div>
					</div>					
					<div className={classString(this.state.dataRow.Niveau,"lvl")}>
						<div className="col-lg-6">
						<h2>{this.state.dataRow.Nom}</h2>
						</div>
						<div className="col-lg-6">
							<div className="row">
								<div className="col-lg-3 type">
									<p>{this.state.dataRow.NomType}</p>

									<p><span className={'icon '+this.state.dataRow.Icone}></span></p>
								</div>
								<div className="col-lg-3 nameApp">
									<p>{StringifyData(this.state.dataRow.Application, "Application")}</p>
								</div>
								<div className="col-lg-3 comportement">
									<p>{StringifyData(this.state.dataRow.Comportement, "Comportement")}</p>
								</div>
								<div className="col-lg-3 date">
									<p>{this.state.dataRow.Date}</p>
								</div>
							</div>
						</div>
												{
            this.state.dataRow.Transitions_possibles.map(function(listval,i)
            {	
            	var clickIndex = this.onDetailClick.bind(this,i)
            	return (<div className="col-lg-2"><Col className="button"><button onClick={clickIndex} key={i}><h3 > {listval.Nom} </h3> </button></Col></div>);
            }.bind(this) )
          }
					</div>
					<div className='row queryZone'>
						<div className='col-lg-12'>


						<div className={classString(this.state.dataRow.Requete,"requete")}>
							<div className="col-lg-12">
								<h4>Requête :</h4>
							</div>
							<div className="col-lg-12">
								<p>{StringifyData(this.state.dataRow.Requete, "Requete")}</p>
							</div>
						</div>

						  {				  
						  this.state.dataRow.RequeteCorrection != null
						  ? console.log('Pas de requete de correction dans la DB')
						  : 
						  <div className={classString(this.state.dataRow.Requete,"requeteCorrection")}>
								<div className="col-lg-12">
									<h4>Requête de correction :</h4>
								</div>
								<div className="col-lg-12">
									<p>{StringifyData(this.state.dataRow.RequeteCorrection, "Requete de Correction")}</p>						
								</div>
							</div>
							}

						</div>
					</div>

			</div>
		);
}
else {
	// afficher l'animation de chargement
	return (<div>loading</div>)
	}
}

}
