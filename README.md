# open.io

View hosted source code of packages.

## Usage

```
https://openit.io/**<alias>**</strong>/**<package-name>**
```

### npm 

Aliases: /npm, /js, /javascript

- Normal package: [https://openit.io/js/preact](https://openit.io/js/preact)
- Scoped package: [https://openit.io/js/@phenomic/core](https://openit.io/js/@phenomic/core)

### Component / Packagist

Aliases: /php, /packagist, /composer

- [https://openit.io/php/laravel/laravel](https://openit.io/php/laravel/laravel)

## Power users

Add these function to your .bashrc/.profile:

### Openit right from CLI

```sh
function openit() {
  open "http://openit.io/$1"
}
```


Then call it like this: 

```sh
$ openit js/preact
```

### Git clone with openit

```sh
function clone() {
  git clone $(curl -Ls -o /dev/null -w %{url_effective} https://openit.io/$1)
}
```

Then call it like this: 

```sh
$ clone js/preact
```