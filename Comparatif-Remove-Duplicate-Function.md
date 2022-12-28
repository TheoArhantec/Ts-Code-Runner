# Comparatif-Remove-Duplicate-Function

Ceci est benchmark de type Operation par seconde.
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



 résultat: 6,459,547.667 Ops/s
 
---
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



 résultat: 5,427,484.333 Ops/s
 
---
### [BENCHMARK] - removeDuplicate


```
function removeDuplicate(array) {
    return [...new Set(array)];
}
```



 résultat: 3,132,100.333 Ops/s
 