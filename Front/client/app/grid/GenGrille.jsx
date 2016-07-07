var React = require('react');
import {AgGridReact} from 'ag-grid-react';
import axios from 'axios';
import { browserHistory } from 'react-router'

require("!style!css!less!../assets/_settings.less");
require("!style!css!less!./GenGrille.less");
// https://www.ag-grid.com/angular-grid-styling/index.php

export default class GenGrille extends React.Component{

	constructor(props) {
		super(props);
		this.state = {
			showGrid: true,
			dataRow : [],
			dataCol :['TextMessage'],
			quickFilterText: null,
			//rowHeight : 30,
			allOfTheData : []
		}
		this.transformerCol = this.transformerCol.bind(this)
		this.sizeToFit = this.sizeToFit.bind(this)

		var lineHeight = 50;		 
		var columnDefs = this.getcolumnDefs() ;
		this.gridOptions = {
		// this is how you listen for events using gridOptions
			onModelUpdated () {
			},

			pageSize : 10,
			rowHeight: lineHeight,
			headerHeight : lineHeight,
			rowModelType: 'pagination',
			rowBuffer: 10, // no need to set this, the default is fine for almost all scenarios
			enableFilter : false,
			
			onRowDoubleClicked: (row) => {
				let pathD = '/infos/'+this.props.routeParams.Fk_Alerte+"/"+row.data.Ocurrence_ID
				browserHistory.push("/infos/"+this.props.routeParams.Fk_Alerte+"/"+row.data.Ocurrence_ID)
				},
			onRowClicked: (row) => {
				axios.get('http://localhost:6588/alerting-core/transition/' + row.event.target.getAttribute('tran_id') + '/' + row.event.target.getAttribute('ocurrence_id'))
					.then( function (response) {
						location.reload();
					});
				},
			columnDefs:[{field:'Alerte',headerName:'Alerte2'},]
		}
	}
	getcolumnDefs() {

	}
	componentDidMount() {
		window.addEventListener('resize', this.sizeToFit)
		this.createNewDatasource();
	}

	onQuickFilterText(event) {
		console.log("filtre :"+event.target.value)
		this.setState({quickFilterText: event.target.value});
	}

	sizeToFit(e) {
    this.gridOptions.api.sizeColumnsToFit();
	}

	onPageSizeChanged (pageSize) {
	}

	setRowData(rowData) {
		this.setState({ allOfTheData : rowData })
	}

	createNewDatasource(){
		if(!this.state.allOfTheData){
			console.log('passed');
			return;
		}

		var dataSource = {
			rowCount : this.totalRows, 														//on ne connait pas le nombre de row a l'avance
			pageSize : this.gridOptions.pageSize, 		// nombre de row par page
			getRows: (params) =>{
				//console.log(params);
				axios.get('http://localhost:6588/alerting-core/infos?Fk_Application='+this.props.routeParams.Fk_Alerte+'&page='+parseInt(params.endRow/this.gridOptions.pageSize)+'&per_page='+this.gridOptions.pageSize)
					.then( function (response) {
							this.setRowData(response.data);
							this.transformerCol(this.state.allOfTheData[0]);
							this.sizeToFit();

							var rowsThisPage = response.data;
							var lastRow = parseInt(response.headers['content-max']); //la on définit le nombre de row total pour l'affichage
							params.successCallback(rowsThisPage, lastRow)
					}.bind(this))
					.catch(function (err){
						params.failCallback()
						console.error(err);
					})
			}
		}

		this.gridOptions.api.setDatasource(dataSource);

	}

	componentWillReceiveProps (nextProps) {
	}

		transformerCol(JsonObjet){
				var colAutoGen = []
				var ColoneInvisible = {
						Ocurrence_ID:true
						,Icone:true
						,Transitions_possibles:true
						,id_Etat:true
						,ID_TypeAlerte:true
					} ;
				for(var champ in JsonObjet){
					console.log("champ :" , champ)
					if( ColoneInvisible[champ])
					{
					}
					else{
						var colStandard = {
										headerName : champ,
										field: champ,
										width : 100,
										filter: 'text',
				    					filterParams: {apply: true, newRowsAction: 'keep'},
				    					cellStyle: {
											'white-space': 'normal',
											'word-wrap' :'break-word'
				       			 		}

								};

							if( champ === 'Alerte')
							{
								colStandard.cellRenderer = function(params) {
									var resultat = '<div class="' + params.data.Icone+ '"></div><div class="gridLabel"> ' + params.value +'</div>' ;
									return resultat;
								};
							}

							else {
								if( champ === 'Etat')
								{
									colStandard.cellRenderer = function(params) {
										console.log('**********PARAMS',params)
										var resultat = '<div >  ' + params.value  ;

										for (var i=0;i<params.data.Transitions_possibles.length;i++){
											var curTran = params.data.Transitions_possibles[i] ;
											resultat+='<button Ocurrence_ID="' + params.data.Ocurrence_ID + '" Tran_ID="' + curTran['ID'] + '" >' + curTran['nom'] +  '</button>'
										}
										resultat +='</div>'
										return resultat;
									};
								}
								// Rien à faire
							}
							colAutoGen.push(colStandard);
						}
				}
		this.setState( {dataCol : colAutoGen} )
		}

	onGridReady(params) {
		this.api = params.api;
		this.columnApi = params.columnApi;
	}

	render () {
		console.log("le param est :" +this.props.routeParams.Fk_Alerte)
		return (
				<div>
				<input type="text" onChange={this.onQuickFilterText.bind(this)} placeholder="Type text to filter..."/>
						<div>
								<AgGridReact
								gridOptions={this.gridOptions}
								quickFilterText={this.state.quickFilterText}
								onGridReady={this.onGridReady.bind(this)}
								columnDefs = {this.state.dataCol}
								rowData = {this.state.allOfTheData}
								rowSelection="multiple"
								pageSize = {10}
								enableColResize="true"
								enableSorting="true"
								enableFilter="true"
								groupHeaders="true"
								debug="true"/>
						</div>
				</div>
		);
	}

}