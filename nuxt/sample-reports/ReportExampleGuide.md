# Report Examples

## Show root data

### Query

`$`

### Table Result

<table id="resultTable"><tr><th class="object">Account</th><td class="object"><table><tr><th class="string">Account Name</th><td class="string">Firefly</td></tr><tr><th class="array">Order</th><td class="array"><table><thead><tr><th class="string">OrderID</th><th class="array">Product</th></tr></thead><tbody><tr><td class="string">order103</td><td class="array"><table><thead><tr><th class="string">Product Name</th><th class="number">ProductID</th><th class="string">SKU</th><th class="object">Description</th><th class="number">Price</th><th class="number">Quantity</th></tr></thead><tbody><tr><td class="string">Bowler Hat</td><td class="number">858383</td><td class="string">0406654608</td><td class="object"><table><tr><th class="string">Colour</th><td class="string">Purple</td></tr><tr><th class="number">Width</th><td class="number">300</td></tr><tr><th class="number">Height</th><td class="number">200</td></tr><tr><th class="number">Weight</th><td class="number">0.75</td></tr></table></td><td class="number">34.45</td><td class="number">2</td></tr><tr><td class="string">Trilby hat</td><td class="number">858236</td><td class="string">0406634348</td><td class="object"><table><tr><th class="string">Colour</th><td class="string">Orange</td></tr><tr><th class="number">Width</th><td class="number">300</td></tr><tr><th class="number">Height</th><td class="number">200</td></tr><tr><th class="number">Depth</th><td class="number">210</td></tr><tr><th class="number">Weight</th><td class="number">0.6</td></tr></table></td><td class="number">21.67</td><td class="number">1</td></tr></tbody></table></td></tr><tr><td class="string">order104</td><td class="array"><table><thead><tr><th class="string">Product Name</th><th class="number">ProductID</th><th class="string">SKU</th><th class="object">Description</th><th class="number">Price</th><th class="number">Quantity</th></tr></thead><tbody><tr><td class="string">Bowler Hat</td><td class="number">858383</td><td class="string">040657863</td><td class="object"><table><tr><th class="string">Colour</th><td class="string">Purple</td></tr><tr><th class="number">Width</th><td class="number">300</td></tr><tr><th class="number">Height</th><td class="number">200</td></tr><tr><th class="number">Depth</th><td class="number">210</td></tr><tr><th class="number">Weight</th><td class="number">0.75</td></tr></table></td><td class="number">34.45</td><td class="number">4</td></tr><tr><td class="string">Cloak</td><td class="number">345664</td><td class="string">0406654603</td><td class="object"><table><tr><th class="string">Colour</th><td class="string">Black</td></tr><tr><th class="number">Width</th><td class="number">30</td></tr><tr><th class="number">Height</th><td class="number">20</td></tr><tr><th class="number">Depth</th><td class="number">210</td></tr><tr><th class="number">Weight</th><td class="number">2</td></tr></table></td><td class="number">107.99</td><td class="number">1</td></tr></tbody></table></td></tr></tbody></table></td></tr></table></td></tr></table>


## Traversing JSON

```
$ (Root)
. (Map)
[ ... ] (Filter)
^( ... ) (Order-by)
{ ... } (Reduce)
* (Wildcard)
** (Descendants)
% (Parent)
# (Positional variable binding)
@ (Context variable binding)
```


## Find by property value

### Query

`Account.Order[OrderID = "order103"]`

### Table Result

<table id="resultTable"><tbody><tr><th class="string">OrderID</th><td class="string">order103</td></tr><tr><th class="array">Product</th><td class="array"><table><thead><tr><th class="string">Product Name</th><th class="number">ProductID</th><th class="string">SKU</th><th class="object">Description</th><th class="number">Price</th><th class="number">Quantity</th></tr></thead><tbody><tr><td class="string">Bowler Hat</td><td class="number">858383</td><td class="string">0406654608</td><td class="object"><table><tbody><tr><th class="string">Colour</th><td class="string">Purple</td></tr><tr><th class="number">Width</th><td class="number">300</td></tr><tr><th class="number">Height</th><td class="number">200</td></tr><tr><th class="number">Weight</th><td class="number">0.75</td></tr></tbody></table></td><td class="number">34.45</td><td class="number">2</td></tr><tr><td class="string">Trilby hat</td><td class="number">858236</td><td class="string">0406634348</td><td class="object"><table><tbody><tr><th class="string">Colour</th><td class="string">Orange</td></tr><tr><th class="number">Width</th><td class="number">300</td></tr><tr><th class="number">Height</th><td class="number">200</td></tr><tr><th class="number">Depth</th><td class="number">210</td></tr><tr><th class="number">Weight</th><td class="number">0.6</td></tr></tbody></table></td><td class="number">21.67</td><td class="number">1</td></tr></tbody></table></td></tr></tbody></table>



## Reference Parent Object

### Query

```
/*
% (Parent)
This will select the 'parent' of the current context value. Here, we define 'parent' to be the enclosing object which has the property representing the context value.

This is the only operation which searches 'backwards' in the input data structure. It is implemented by static analysis of the expression at compile time and can only be used within expressions that navigate through that target parent value in the first place. If, for any reason, the parent location cannot be determined, then a static error (S0217) is thrown.
*/

Account.Order.Product.{
  'Product': `Product Name`,
  'Order': %.OrderID,
  'Account': %.%.`Account Name`
}
```

### Result Table

<table id="resultTable"><thead><tr><th class="string">Product</th><th class="string">Order</th><th class="string">Account</th></tr></thead><tbody><tr><td class="string">Bowler Hat</td><td class="string">order103</td><td class="string">Firefly</td></tr><tr><td class="string">Trilby hat</td><td class="string">order103</td><td class="string">Firefly</td></tr><tr><td class="string">Bowler Hat</td><td class="string">order104</td><td class="string">Firefly</td></tr><tr><td class="string">Cloak</td><td class="string">order104</td><td class="string">Firefly</td></tr></tbody></table>