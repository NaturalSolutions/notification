var React = require('react');

require("!style!css!less!../assets/detail.less");
var Transition = require('./Objects/Transition.jsx');

console.log('********************BEZIN**********************',Transition) ;

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
		axios.get('http://localhost:6588/alerting-core/transition/' + index + '/'+this.props.routeParams.id)
					.then( function (response) {
						console.log(response,this) ;
					//alert("Alert was properly deleted");
				//this.setState ( {Rep_call : response.data  } )
			});
			//return ;
		
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
					<div className={classString(this.state.dataRow.Niveau,"lvl")}>
						<div className="col-md-6">
							<div className='row titleRow'>
								<div className="col-md-3">
									<span className={this.state.dataRow.Icone}></span>
									<span className="numero">N° {this.state.dataRow.ID}</span>
								</div>
								<div className="col-md-9"><h2 className='title'>{this.state.dataRow.Nom}</h2></div>
							</div>							
						</div>
						<div className="col-md-6">
							<div className="row">
								<div className="col-md-3 treatedIcon">
									<span className={'icon '+this.state.dataRow.IconeEtat}></span>
									<p>{this.state.dataRow.EtatNom}</p>
								</div>
								<div className="col-md-3 nameApp">
									<span className={'icon '+this.state.dataRow.AppIcone}></span>
									<p>{StringifyData(this.state.dataRow.AppName, "Application")}</p>
								</div>
								
								<div className="col-md-6 date">
									<p>{this.state.dataRow.DateOccurence}</p>
								</div>
							</div>
						</div>
												
					</div>
					<div className='container queryZone'>

						<div className='row'>					
						
							<div className='col-lg-12 actionZone'>
								{
									this.state.dataRow.Transitions_possibles.map(function(listval,i)
									{	
										var clickIndex = this.onDetailClick.bind(this,i)
										return (																								
											<button className="btn btn-success pull-left" onClick={clickIndex} key={i}>
												{listval.Nom} 													
												<span className={listval.IconeEtat}></span>													
											</button>												
										);
									}.bind(this) )
								}
							</div>									
						
							<div className="col-lg-12 concernedZone">
								<h4>Concerned {this.state.dataRow.ObjetConcerne}:</h4>
								{
									
									this.state.dataRow.URLs.map(function(elID,index)
									{
										console.log(elID,index)
										return <li key={elID}><a href={elID} target="_blank">See Concerned Object {index+1}</a></li>											
									})

								}
							</div>							
							
							
							
							<div className="col-lg-12 Requete">
								<h4>Requête :</h4>							
								<p>{StringifyData(this.state.dataRow.Requete, "Requete")}</p>
							</div>
							
							
							
							{				  
								this.state.dataRow.RequeteCorrection != null
								? console.log('Pas de requete de correction dans la DB')
								: 

								<div className="col-lg-12 requeteCorrection">
									<h4>Requête de correction :</h4>							
									<p>{StringifyData(this.state.dataRow.RequeteCorrection, "Requete de Correction")}</p>						
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
