from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProductViewSet,SubPartViewSet,ProductSubpartViewSet,SubContractorViewSet
# from .views import create_product
from .views import TransactionLogViewSet
router = DefaultRouter()
router.register(r'products', ProductViewSet)
router.register(r'subparts',SubPartViewSet)
router.register(r'productsubparts',ProductSubpartViewSet)
router.register(r'subcontractors', SubContractorViewSet)
router.register(r'logs',TransactionLogViewSet)
urlpatterns = [
    # path('products/create/', create_product, name='create_product'),
    path('', include(router.urls)),
]