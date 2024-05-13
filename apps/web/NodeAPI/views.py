from django.shortcuts import redirect, render
from django.urls import reverse
from rest_framework import viewsets
from .models import Product,Subpart,ProductSubpart,SubContractor
from .serializers import ProductSerializer,ProductSubpartSerializer,SubpartSerializer,SubContractorSerializer
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer

    def create(self, request, *args, **kwargs):
        data = request.data
        if isinstance(data, list):  # Check if multiple products are provided
            serializer = self.get_serializer(data=data, many=True)
            serializer.is_valid(raise_exception=True)
            self.perform_create(serializer)
            headers = self.get_success_headers(serializer.data)
            return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
        else:  # Handle single product creation
            return super(ProductViewSet, self).create(request, *args, **kwargs)

    @action(detail=True, methods=['get'])
    def subparts(self, request, pk=None):
        product = self.get_object()
        product_subparts = ProductSubpart.objects.filter(product=product)
        subparts = [ps.subpart for ps in product_subparts]
        serializer = SubpartSerializer(subparts, many=True)
        return Response(serializer.data)



class SubPartViewSet(viewsets.ModelViewSet):
    queryset = Subpart.objects.all()
    serializer_class = SubpartSerializer

    def create(self, request, *args, **kwargs):
        data = request.data
        if isinstance(data, list):
            serializer = self.get_serializer(data=data, many=True)
            serializer.is_valid(raise_exception=True)
            self.perform_create(serializer)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return super(SubPartViewSet, self).create(request, *args, **kwargs)


class ProductSubpartViewSet(viewsets.ModelViewSet):
    queryset = ProductSubpart.objects.all()
    serializer_class = ProductSubpartSerializer

    def create(self, request, *args, **kwargs):
        data = request.data
        if isinstance(data, list):
            serializer = self.get_serializer(data=data, many=True)
            serializer.is_valid(raise_exception=True)
            self.perform_create(serializer)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return super(ProductSubpartViewSet, self).create(request, *args, **kwargs)

class SubContractorViewSet(viewsets.ModelViewSet):
    queryset = SubContractor.objects.all()
    serializer_class = SubContractorSerializer

    def create(self, request, *args, **kwargs):
        data = request.data
        if isinstance(data, list):
            serializer = self.get_serializer(data=data, many=True)
            serializer.is_valid(raise_exception=True)
            self.perform_create(serializer)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return super(SubContractorViewSet, self).create(request, *args, **kwargs)


from .serializers import TransactionLogSerializer
from .models import TransactionLog

class TransactionLogViewSet(viewsets.ModelViewSet):
    queryset = TransactionLog.objects.all()
    serializer_class = TransactionLogSerializer



# from django.shortcuts import render, redirect
# from django.http import JsonResponse
# from .models import Product, Subpart, ProductSubpart
# import json
# from .forms import ProductForm

# def create_product(request):
#     if request.method == 'POST':
#         form = ProductForm(request.POST)
#         if form.is_valid():
#             # Save the Product form but don't commit to DB yet as we need to manually set some fields
#             product = form.save(commit=False)
            
#             # Extract and set the calculated fields from the form
#             product.number_of_units = request.POST.get('number_of_units', 0)
#             product.co2_per_unit = request.POST.get('co2_per_unit', 0.0)
#             # Now save Product to DB
#             product.save()

#             # Process the dynamically added subparts
#             subparts_data = request.POST.getlist('subparts[]')
#             for subpart_str in subparts_data:
#                 subpart_data = json.loads(subpart_str)
                
#                 # Ensure you're handling the possibility of the subpart already existing correctly
#                 subpart, created = Subpart.objects.get_or_create(
#                     name=subpart_data['name'],
#                     defaults={
#                         'co2_footprint': subpart_data['co2_per_unit'],
#                         # Add any additional default fields here
#                     }
#                 )
                
#                 # Calculate the quantity needed per product from subpart_data
#                 quantity_needed_per_product = subpart_data.get('units_needed_per_product', 0)

#                 # Link the Subpart to the Product with the specified quantity
#                 ProductSubpart.objects.create(
#                     product=product,
#                     subpart=subpart,
#                     quantity_needed_per_unit=quantity_needed_per_product,
#                     units_to_buy=subpart_data['units_bought']
#                 )

#             return redirect('../')  # Redirect as appropriate
#     else:
#         form = ProductForm()

#     return render(request, 'create_product.html', {'form': form})