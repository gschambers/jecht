import test from "tape";
import { Factory, Inject, Injector, Provides } from "../src";

test("Basic injection", function(t) {
    t.plan(1);

    class Foo {

    }

    @Inject(Foo)
    class Bar {
        constructor(foo: Foo) {
            t.ok(foo instanceof Foo);
        }
    }

    var injector = new Injector();
    injector.get(Bar);
});

test("Multiple annotations", function(t) {
    t.plan(2);

    class Foo {

    }

    class Bar {

    }

    @Inject(Foo)
    @Inject(Bar)
    class Baz {
        constructor(foo: Foo, bar: Bar) {
            t.ok(foo instanceof Foo);
            t.ok(bar instanceof Bar);
        }
    }

    var injector = new Injector();
    injector.get(Baz);
});

test("Complex graph", function(t) {
    t.plan(6);

    class Foo {

    }

    @Inject(Foo)
    class Bar {
        constructor(foo: Foo) {
            t.ok(foo instanceof Foo);
        }
    }

    @Inject(Foo, Bar)
    class Baz {
        constructor(foo: Foo, bar: Bar) {
            t.ok(foo instanceof Foo);
            t.ok(bar instanceof Bar);
        }
    }

    @Inject(Foo, Bar, Baz)
    class Quux {
        constructor(foo: Foo, bar: Bar, baz: Baz) {
            t.ok(foo instanceof Foo);
            t.ok(bar instanceof Bar);
            t.ok(baz instanceof Baz);
        }
    }

    var injector = new Injector();
    injector.get(Quux);
});

test("Custom provider", function(t) {
    t.plan(1);

    class Foo {

    }

    @Provides(Foo)
    class MockFoo {

    }

    @Inject(Foo)
    class Bar {
        constructor(foo: Foo) {
            t.ok(foo instanceof MockFoo);
        }
    }

    var injector = new Injector([MockFoo]);
    injector.get(Bar);
});

test("Factory provider", function(t) {
    t.plan(2);

    class Foo {

    }

    class Bar {

    }

    const fooFactory = Factory.create(function(): Foo | Bar {
        return useFoo ? Foo : Bar;
    });

    @Inject(fooFactory)
    class Baz {
        constructor(svc: Foo | Bar) {
            t.ok(svc instanceof Foo);
        }
    }

    var useFoo = true;
    var injector1 = new Injector();
    var baz = injector1.get(Baz);

    @Inject(fooFactory)
    class Quux {
        constructor(svc: Foo | Bar) {
            t.ok(svc instanceof Bar);
        }
    }

    useFoo = false;
    var injector2 = new Injector();
    var quux = injector2.get(Quux);

});
