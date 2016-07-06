from datetime import datetime,date
from decimal import Decimal
from urllib.parse import quote_plus
from sqlalchemy import engine_from_config
from pyramid.config import Configurator
# from pyramid.request import Request, Response
from pyramid.renderers import JSON
from pyramid.authentication import AuthTktAuthenticationPolicy
from pyramid.authorization import ACLAuthorizationPolicy
from pyramid.events import NewRequest
from sqlalchemy.orm import scoped_session, sessionmaker

from .controllers.security import SecurityRoot
from .Models import (
    DBSession,
    Base,
    dbConfig,
    db
    )
from .Views import add_routes,add_cors_headers_response_callback

"""Json adapter for datetime objects."""
def datetime_adapter(obj, request):
    """Json adapter for datetime objects."""
    try: 
        return obj.strftime ('%d/%m/%Y %H:%M:%S')
    except :
        return obj.strftime ('%d/%m/%Y')

def date_adapter(obj, request):
    """Json adapter for datetime objects."""
    return obj.strftime ('%d/%m/%Y')

def decimal_adapter(obj, request):
    """Json adapter for Decimal objects.
    """
    return float(obj)

def bytes_adapter(obj, request):
    return base64.b64encode(obj).decode()

def main(global_config, **settings):
    """ This function returns a Pyramid WSGI application.
    """
    settings['sqlalchemy.url'] = settings['cn.dialect'] + quote_plus(settings['sqlalchemy.url'])
    engine = engine_from_config(settings, 'sqlalchemy.')
    dbConfig['url'] = settings['sqlalchemy.url']

    """ Configuration de la connexion à la BDD """
    # DBSession.configure(bind=engine)
    Base.metadata.bind = engine
    Base.metadata.create_all(engine)
    Base.metadata.reflect(views=True)

    """ Configuration du serveur pyramid"""
    config = Configurator(settings=settings)
    # Add renderer for datetime objects
    json_renderer = JSON()
    json_renderer.add_adapter(datetime, datetime_adapter)
    json_renderer.add_adapter(date, date_adapter)
    json_renderer.add_adapter(Decimal, decimal_adapter)
    json_renderer.add_adapter(bytes, bytes_adapter)
    config.add_renderer('json', json_renderer)
    config.registry.dbmaker = scoped_session(sessionmaker(bind=engine))
    config.add_request_method(db, name='dbsession', reify=True)
    # Set up authentication and authorization

    config.set_root_factory(SecurityRoot)
    config.add_subscriber(add_cors_headers_response_callback, NewRequest)

    # Set the default permission level to 'read'
    config.set_default_permission('read')
    config.include('pyramid_tm')
    add_routes(config)
    config.scan()
    return config.make_wsgi_app()
