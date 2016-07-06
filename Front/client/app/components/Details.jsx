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
		console.log('*********INDEX ****************',index);
		axios.get('http://localhost:6588/alerting-core/transition/1/'+this.props.routeParams.id)
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
									<p>{this.state.dataRow.EtatNom}</p>

									<p><span className={'icon '+this.state.dataRow.Icone}></span></p>
								</div>
								<div className="col-lg-3 nameApp">
									<p>{StringifyData(this.state.dataRow.AppName, "Application")}</p>
								</div>
								
								<div className="col-lg-3 date">
									<p>{this.state.dataRow.DateOccurence}</p>
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

						<div >
							<div className="col-lg-12 row requete ">
								<div className="col-lg-12">
									<h4>Concerned {this.state.dataRow.ObjetConcerne}:</h4>
								</div>
									
							
							<div className="col-lg-12">
								{
									
									this.state.dataRow.URLs.map(function(elID,index)
									{
										console.log(elID,index)
										return <li key={elID}><a href={elID} target="_blank">See Concerned Object {index+1}</a></li>
										//return <li key={elID}>bezin</li>
										//React.createElement('a', {href: this.state.dataRow.URL.replace('@id','1'),target:'_blank',key:el.ID}, 'Link!')
									})

										
									
									// for (int i=0;i<this.state.dataRow.IDs.length;i++) 
									// {
									// 	React.createElement('a', {href: this.state.dataRow.URL.replace('@id',this.state.dataRow.IDs[i]),target:'_blank'}, 'Link!')
									// }
								}
							</div>
						</div>
						<div className={classString(this.state.dataRow.Requete,"requete")}>
							<div className="col-lg-12">
								<h4>Requête :</h4>
							</div>
							<div className="col-lg-12">
								<p>{StringifyData(this.state.dataRow.Requete, "Requete")}</p>
							</div>
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
