var React = require('react');
import {AgGridReact} from 'ag-grid-react';
import axios from 'axios';
import { browserHistory } from 'react-router'

require("!style!css!less!../assets/grid.less");
// https://www.ag-grid.com/angular-grid-styling/index.php

export default class GenGrille extends React.Component{

	constructor(props) {
		super(props);
		this.state = {
			showGrid: true,
			dataRow : [],
			dataCol :[],
			quickFilterText: null,
			rowHeight : 30,
			allOfTheData : []
		}
		 this.transformerCol = this.transformerCol.bind(this)
		 this.sizeToFit = this.sizeToFit.bind(this)

		this.gridOptions = {
		// this is how you listen for events using gridOptions
			onModelUpdated () {
			},

			pageSize : 10,
			rowHeight: 30,
			rowModelType: 'pagination',
			rowBuffer: 10, // no need to set this, the default is fine for almost all scenarios
			enableFilter : false,

			onRowDoubleClicked: (row) => {
				let pathD = '/infos/'+this.props.routeParams.Fk_Alerte+"/"+row.data.Ocurrence_ID
					// axios.get('http://127.0.0.1:6544/alerting-core/infos/'+row.data.Alerte_ID )
					// .then( function (response) {
					// 		this.setState ( {dataRow : response.data  } )
					// 		this.transformerCol(this.state.dataRow[0])
					// 		this.sizeToFit()
					// }.bind(this))
					// .catch(function (response){
					// 		console.log(response)
					// 	})
				console.log("on va vers"+pathD)
				browserHistory.push("/infos/"+this.props.routeParams.Fk_Alerte+"/"+row.data.Ocurrence_ID)
				}


				// 			onCellClicked: (cell) => {
				// let pathD = '/infos/'+this.props.routeParams.Fk_Alerte+"/"+row.data.Ocurrence_ID
				//  axios.get('http://127.0.0.1:6544/alerting-core/infos/'+row.data.Alerte_ID )
				// 	.then( function (response) {
				// 			this.setState ( {dataRow : response.data  } )
				// 			this.transformerCol(this.state.dataRow[0])
				// 			this.sizeToFit()
				// 	}.bind(this))
				// 	.catch(function (response){
				// 			console.log(response)
				// 		})
				// console.log("on va vers"+pathD)
				// browserHistory.push("/infos/"+this.props.routeParams.Fk_Alerte+"/"+row.data.Ocurrence_ID)
				// }

			}


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
				axios.get('http://192.168.0.43:6544/alerting-core/infos?Fk_Alerte='+this.props.routeParams.Fk_Alerte+'&page='+parseInt(params.endRow/this.gridOptions.pageSize)+'&per_page='+this.gridOptions.pageSize)
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
				var delete_button = 'delete'
							var colAutoGen = []
				// colAutoGen.push({
				// headerName : '#',
				// width: 5,
				// checkboxSelection: true,
				// suppressSorting: true,
    //     suppressMenu: true,
    //     pinned: true,
    // 		suppressRowClickSelection: true,
    //   })
				for(var champ in JsonObjet){
					console.log("champ :" , champ)
					if( champ === 'ID' || champ ==='id')
					{
						console.log("on va mettre le champ id")
						colAutoGen.push({
							headerName : champ,
							field: champ,
							width : 30,
							filter: 'text',
	    				filterParams: {apply: true, newRowsAction: 'keep'},
	    				suppressMovable	: true
						})
					}
					else{
							colAutoGen.push({
									headerName : champ,
									field: champ,
									width : 100,
									filter: 'text',
			    				filterParams: {apply: true, newRowsAction: 'keep'},
			    				cellStyle: {
			            'white-space': 'normal',
			            'word-wrap' :'break-word'
			       			 }

									})
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
						<div style={{height: 400}} className="ag-green">
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
								rowHeight={this.state.rowHeight}
								debug="true"/>
						</div>
				</div>
		);
	}

}