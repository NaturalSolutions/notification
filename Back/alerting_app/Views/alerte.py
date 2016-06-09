from pyramid.security import NO_PERMISSION_REQUIRED
from pyramid.view import view_config
from ..Models import DBSession,Base
from pyramid.response import Response
from sqlalchemy import select,text,bindparam,and_,func,Float,exists
from sqlalchemy.sql.functions import GenericFunction
from datetime import datetime, timedelta
import json


# class var_(GenericFunction):
# 	type = Float
# 	name = 'VAR'

# print(select([func.var_()]))

# @view_config(route_name='alerte',renderer='json',permission=NO_PERMISSION_REQUIRED )
# def getAlertingLogs(request):

# 	# print(request.params.mixed())
# 	# id_ = request.matchdict['id']

# 	params = request.params.mixed()
# 	engTable = Base.metadata.tables['Sensor_View_Tgps_engineering']
# 	argosTable = Base.metadata.tables['Sensor_View_T_argosgps']

# 	query_nest = select([engTable.c['FK_ptt']]).where(engTable.c['txDate'] > (datetime.now() - timedelta(days=15)))

# 	query_nest = query_nest.where(engTable.c['FK_ptt'] == argosTable.c['FK_ptt'])

# 	query_nest = query_nest.group_by(engTable.c['FK_ptt']).having(func.var(engTable.c['activity'])<5)

# 	query = select([argosTable.c['PK_id'], argosTable.c['date'], argosTable.c['FK_ptt'], argosTable.c['lat'], argosTable.c['lon'], argosTable.c['type']])

# 	query = query.where(exists(query_nest))

# 	query = query.where(and_(argosTable.c['type'] == 'gps', argosTable.c['date'] > (datetime.now() - timedelta(days=15 ))))

# 	results = DBSession.execute(query).fetchall()
# 	print(type(results))

# 	data = [dict(row) for row in results]
# 	return data

