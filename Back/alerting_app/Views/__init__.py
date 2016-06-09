from pyramid.httpexceptions import default_exceptionresponse_view, HTTPNotFound
from pyramid.interfaces import IRoutesMapper
from pyramid.view import view_config
from pyramid.security import NO_PERMISSION_REQUIRED


def add_cors_headers_response_callback(event):
    def cors_headers(request, response):
        response.headers.update({
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST,GET,DELETE,PUT,OPTIONS',
        'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Authorization',
        'Access-Control-Allow-Credentials': 'true',
        'Access-Control-Expose-Headers' : 'true',
        'Access-Control-Max-Age': '1728000',
        'Access-Control-Expose-Headers': 'Content-Max'

        })
    event.request.add_response_callback(cors_headers)



def integers(*segment_names):
    def predicate(info, request):
        match = info['match']
        for segment_name in segment_names:
            try:
                print (segment_names)
                match[segment_name] = int(match[segment_name])
                if int(match[segment_name]) == 0 :
                    print(' ****** ACTIONS FORMS ******')
                    return False
            except (TypeError, ValueError):
                return False
        return True
    return predicate

def add_routes(config):
    ##### Security routes #####
    config.add_route('vignettes', 'alerting-core/vignettes')
    config.add_route('infos', 'alerting-core/infos')
    config.add_route('infos/id', 'alerting-core/infos/{id}')
    # config.add_route('details' , 'alerting-core/details/{id}')
    config.add_route('delete/id' , 'alerting-core/delete/{id}')
    config.add_route('ignore/id' , 'alerting-core/ignore/{id}')
    config.add_route('treat/id' , 'alerting-core/treat/{id}')
    config.add_route('putonhold/id' , 'alerting-core/putonhold/{id}')
    # config.add_route('security/logout', 'portal-core/security/logout')
    # config.add_route('security/has_access', 'portal-core/security/has_access')

    # ##### User #####
    # config.add_route('core/user', 'portal-core/users')
    # config.add_route('core/user/id', 'portal-core/users/{id}')
    # config.add_route('core/user/adress', 'portal-core/users/adress')
    
    
    # config.add_route('core/user/id/adress', 'portal-core/users/{id}/adress')
    # config.add_route('core/adress/id', 'portal-core/adress/{id}')

    pass
