# Comparatif-Remove-Duplicate-Function

### [BENCHMARK] - removeDuplicateWithArray


```
function removeDuplicateWithArray(array) {
    const arrayWithoutDuplicate = [];
    for (let index = 0; index < array.length; index++) {
        const element = array[index];
        if (array.includes(element))
            continue;
        array.push(element);
    }
    return arrayWithoutDuplicate;
}
```



 résultat: 5,460,848.000 Ops/s
 
---
### [BENCHMARK] - removeDuplicateWithMap


```
function removeDuplicateWithMap(array) {
    const arrayWithoutDuplicate = [];
    const map = {};
    for (let index = 0; index < array.length; index++) {
        const element = array[index];
        if (!map[element])
            continue;
        map[element] = true;
        array.push(element);
    }
    return arrayWithoutDuplicate;
}
```



 résultat: 6,426,100.667 Ops/s
 
---
### [BENCHMARK] - removeDuplicate


```
function removeDuplicate(array) {
    return [...new Set(array)];
}
```



 résultat: 3,033,142.000 Ops/s
 