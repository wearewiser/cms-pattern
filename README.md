# @wiser/cms-pattern

A TypeScript implementation of the *Repository Pattern* that can be used to build structured client-side libraries for consuming page data from CMS systems.

## Table of Contents

- [Quick Start](#quick-start)
  * [Installation](#installation)
  * [Usage](#usage)
- [Public Exports](#public-exports)
  * [SinglePageRepository](#singlepagerepository)
  * [MultiPageRepository](#multipagerepository)
  * [SinglePageRepositoryRegistration](#singlepagerepositoryregistration)
  * [MultiPageRepositoryRegistration](#multipagerepositoryregistration)
  * [PageDownloader](#pagedownloader)
  * [CmsPageFilter](#cmspagefilter)
  * [CMS](#cms)
- [Example Implementation](#example-implementation)

## Quick Start

### Installation

```bash
npm install --save @wiser/cms-pattern
```

### Usage

First define your page model. Be sure to make sure it is defined at a **class**. This is your contract that should be implemented in the view template. We will ensure that our home page repository always maintains this contract.

```TypeScript
export class HomePage {
  public title!: string;
  public subtitle!: string;
  public body!: string;
}
```

Then implement a [SinglePageRepository](#SinglePageRepository) to resolve the `HomePage` class.

```TypeScript
import { SinglePageRepository } from '@wiser/cms-patterm';
import { HomePage } from './';

class DemoHomePageRepository implements SinglePageRepository<HomePage, undefined>  {
  ...
  public async read(): Promise<HomePage> {
    // Fetch the data
    //
    // This is probably more involved then demonstrated
    const page_data: JsonHomePage = ...;
    // Instantiate and assign props
    //
    // Ideally, a Factory pattern is implemented
    // to take the raw source data and return an
    // the instantiated target object
    const page = new HomePage();
    page.title = page_data.title;
    page.subtitle = page_data.subtitle;
    page.body = page_data.body;
    return page;
  }
}
```

> **Note**
>
> We can also have implemented [MultiPageRepository](#MultiPageRepository) to resolve a set of pages that are instantiations of the same class.

```TypeScript
import {
  PageDownloader,
  SinglePageRepositoryRegistration,
} from '@wiser/cms-pattern';
import {
  HomePage,
  DemoHomePageRepository,
} from './';

export class DemoPageDownloader extends PageDownloader<Object, unknown> {
  protected readonly registrations = [
    ...
    new SinglePageRepositoryRegistration(
      HomePage,
      DemoHomePageRepository,
    ),
    ...
  ];
}
```

We are not ready to download the `HomePage`. We can do this wherever, whenever.

```TypeScript
import {
  DemoPageDownloader,
  HomePage,
} from './';

const downloader = new DemoPageDownloader();
downloader.downloadPage(HomePage, undefined);
```

After, or before, calling `downloadPage` on the `DemoPageDownloader`, we can use the [CMS](#CMS) class to access the page data.

```TypeScript
import { CMS } from '@wiser/cms-pattern';
import { HomePage } from './';

const cms = new CMS();

cms.page(HomePage).subscribe(
  page => console.log(page),
);
// output:
// HomePage { title: ..., subtitle: ..., body: ... }
```

## Public Exports

### SinglePageRepository

*\<\<interface\>\>* **SinglePageRepository<T, S>**

A subset of `ReadonlyRepository<T, S>` omiting list. Data of type `T` can be accessed by id of type `S`.

Implement this interface with the logic for accessing data and resolving an instantiation of the target model when there exists a single upstream instance of the model.

### MultiPageRepository

*\<\<interface\>\>* **MultiPageRepository<T, S>**

A mirror of `ReadonlyRepository<T, S>`. Data of type `T` can be accessed by id of type `S`.

Implement this interface with the logic for accessing data and resolving an instantiation of the target model when there exists multiple upstream instances of the model.

### SinglePageRepositoryRegistration

**SinglePageRepositoryRegistration<T, S>**

An implementation of `RepositoryRegistration<T, S>` that requires that the `Data` property map to a the [SinglePageRepository<T, S>](#SinglePageRepository) implementation on the `Repository` property.

This is simply instantiated and provided to an extension [PageDownloader](#PageDownloader) in the `registrations` property.

### MultiPageRepositoryRegistration

**MultiPageRepositoryRegistration<T, S>**

An implementation of `RepositoryRegistration<T, S>` that requires that the `Data` property map to a the [MultiPageRepository<T, S>](#MultiPageRepository) implementation on the `Repository` property.

This is simply instantiated and provided to an extension [PageDownloader](#PageDownloader) in the `registrations` property.

### PageDownloader

*\<\<abstract\>\>* **PageDownloader<T, S>**

Allows extending class to register page repositories, and then exposes methods for downloading page data of type T from the assigned Repository instances matching on id of type S as defined in the Repository implementation.

### CmsPageFilter

*\<\<type\>\>* **PageDownloader<T, S>**

A filter to be applied on an instance of type T, where a key of T is provided and value of unknown type must be matched.

### CMS

**PageDownloader<T>**

Provides access to CMS state through `Observables` to specific instantiations resolved by [PageDownloader<T, S>](#PageDownloader) repositorty registrations. The `page` and `streamPage` methods can take optional [CmsPageFilters](#CmsPageFilter).

## Example Implementation

```TypeScript
import {
  SinglePageRepository,
  MultiPageRepository,
  PageDownloader,
  SinglePageRepositoryRegistration,
  MultiPageRepositoryRegistration,
  CMS,
  CmsPageFilter,
} from '@wiser/cms-pattern';

////////////////////////////////////////
// Datasources
////////////////////////////////////////

// Fake JSON data
const JSON_PAGES = {
  home: {
    title: 'title',
    subtitle: 'subtitle',
    body: 'body',
  },
  about: {
    title: 'title',
    body: 'body',
    about: 'about',
  },
  blogs: [
    {
      id: '1',
      entry: 'Hello, world!',
      published: '2020-01-03',
    },
    {
      id: '2',
      entry: 'Goodbye, curel world!',
      published: '2020-02-29',
    },
  ],
};

// Fake XML data
const XML_PAGES = `
<pages>
  <homepage>
    <title>title</title>
    <subtitle>title</subtitle>
    <body>title</body>
  </homepage>
  <aboutpage>
    <title>title</title>
    <body>body</body>
    <about>about</about>
  </aboutpage>
  <blogpages>
    <blogpage>
      <id>1</id>
      <entry>Hello, world!</entry>
      <published>2020-01-03</published>
    </blogpage>
    <blogpage>
      <id>2</id>
      <entry>Goodbye, curel world!</entry>
      <published>2020-02-29</published>
    </blogpage>
  </blogpages>
</pages>
`;

////////////////////////////////////////
// Client Code
////////////////////////////////////////

// datasource models

type JsonHomePage = {
  title: string;
  subtitle: string;
  body: string;
};

type JsonAboutPage = {
  title: string;
  body: string;
  about: string;
};

type JsonBlogPage = {
  id: string;
  entry: string;
  published: string;
};

type XmlHomePage = string;

type XmlAboutPage = string;

type XmlBlogPage = string;

// page models

class HomePage {
  public title!: string;
  public subtitle!: string;
  public body!: string;
}

class AboutPage {
  public title!: string;
  public body!: string;
  public about!: string;
}

class BlogPage {
  public id!: number;
  public post!: string;
  public date!: Date;
}

// repository models

interface HomePageRepository extends SinglePageRepository<HomePage, undefined> { }

interface AboutPageRepository extends SinglePageRepository<AboutPage, undefined> { }

interface BlogPageRepository extends MultiPageRepository<BlogPage, number> { }

// repository implementations

class JsonHomePageRepository implements HomePageRepository {
  private data = JSON_PAGES;
  public async read(): Promise<HomePage> {
    // Fetch the data
    //
    // This is probably more involved then demonstrated
    const page_data: JsonHomePage = this.data.home;
    // Instantiate and assign props
    //
    // Ideally, a Factory pattern is implemented
    // to take the raw source data and return an
    // the instantiated target object
    const page = new HomePage();
    page.title = page_data.title;
    page.subtitle = page_data.subtitle;
    page.body = page_data.body;
    return page;
  }
}

class JsonAboutPageRepository implements AboutPageRepository {
  private data = JSON_PAGES;
  public async read(): Promise<AboutPage> {
    // Fetch the data
    //
    // This is probably more involved then demonstrated
    const page_data: JsonAboutPage = this.data.about;
    // Instantiate and assign props
    //
    // Ideally, a Factory pattern is implemented
    // to take the raw source data and return an
    // the instantiated target object
    const page = new AboutPage();
    page.title = page_data.title;
    page.body = page_data.body;
    page.about = page_data.about;
    // return the instance
    return page;
  }
}

class JsonBlogPageRepository implements BlogPageRepository {
  private data = JSON_PAGES;
  public async read(id: number): Promise<BlogPage> {
    // Fetch the data
    //
    // This is probably more involved then demonstrated
    const pages = await this.list();
    const page = pages.find(page => page.id === id);
    if (!page) {
      throw new Error(`Blog page ${id} not found`);
    }
    // return the instance
    return page;
  }
  public async list(): Promise<BlogPage[]> {
    // Fetch the data
    //
    // This is probably more involved then demonstrated
    const pages = this.data.blogs.map(
      (page_data: JsonBlogPage) => {
        // Instantiate and assign props
        //
        // Ideally, a Factory pattern is implemented
        // to take the raw source data and return an
        // the instantiated target object
        const page = new BlogPage();
        page.id = +page_data.id;
        page.post = page_data.entry;
        page.date = new Date(page_data.published);
        return page;
      },
    );
    // return the instance
    return pages;
  }
}

class XmlHomePageRepository implements HomePageRepository {
  private data = XML_PAGES;
  public async read(): Promise<HomePage> {
    // Fetch the data
    //
    // This is probably more involved then demonstrated
    const page_data: XmlHomePage =
      (this.data.replace(/\n/g, '').match(/<aboutpage>(.+)<\/aboutpage>/) || ['', ''])[1];
    // Instantiate and assign props
    //
    // Ideally, a Factory pattern is implemented
    // to take the raw source data and return an
    // the instantiated target object
    const page = new HomePage();
    page.title =
      (page_data.replace(/\n/g, '').match(/<title>(.+)<\/title>/) || ['', ''])[1];
    page.subtitle =
      (page_data.replace(/\n/g, '').match(/<subtitle>(.+)<\/subtitle>/) || ['', ''])[1];
    page.body =
      (page_data.replace(/\n/g, '').match(/<body>(.+)<\/body>/) || ['', ''])[1];
    // return the instance
    return page;
  }
}

class XmlAboutPageRepository implements AboutPageRepository {
  private data = XML_PAGES;
  public async read(): Promise<AboutPage> {
    // Fetch the data
    //
    // This is probably more involved then demonstrated
    const page_data: XmlAboutPage =
      (this.data.replace(/\n/g, '').match(/<aboutpage>(.+)<\/aboutpage>/) || ['', ''])[1];
    // Instantiate and assign props
    //
    // Ideally, a Factory pattern is implemented
    // to take the raw source data and return an
    // the instantiated target object
    const page = new AboutPage();
    page.title =
      (page_data.replace(/\n/g, '').match(/<title>(.+)<\/title>/) || ['', ''])[1];
    page.body =
      (page_data.replace(/\n/g, '').match(/<body>(.+)<\/body>/) || ['', ''])[1];
    page.about =
      (page_data.replace(/\n/g, '').match(/<about>(.+)<\/about>/) || ['', ''])[1];
    // return the instance
    return page;
  }
}

class XmlBlogPageRepository implements BlogPageRepository {
  private data = XML_PAGES;
  public async read(id: number): Promise<BlogPage> {
    // Fetch the data
    //
    // This is probably more involved then demonstrated
    const pages = await this.list();
    const page = pages.find(page => page.id === id);
    if (!page) {
      throw new Error(`Blog page ${id} not found`);
    }
    // return the instance
    return page;
  }
  public async list(): Promise<BlogPage[]> {
    // Fetch the data
    //
    // This is probably more involved then demonstrated
    const pages_data: XmlAboutPage[] = this.data.replace(/\n/g, '').match(/<blogpage>(.+?)<\/blogpage>/g) || [];
    const pages = pages_data.map(
      (page_data: XmlBlogPage) => {
        // Instantiate and assign props
        //
        // Ideally, a Factory pattern is implemented
        // to take the raw source data and return an
        // the instantiated target object
        const page = new BlogPage();
        page.id =
          +(page_data.replace(/\n/g, '').match(/<id>(.+)<\/id>/) || ['', ''])[1];
        page.post =
          (page_data.replace(/\n/g, '').match(/<entry>(.+)<\/entry>/) || ['', ''])[1];
        page.date =
          new Date(
            (page_data.replace(/\n/g, '').match(/<published>(.+)<\/published>/) || ['', ''])[1],
          );
        return page;
      },
    );
    // return the instance
    return pages;
  }
}

// downloader implementation

class SiteContentDownloader extends PageDownloader<Object, unknown> {
  // We can register multiple SinglePageRepository<T, ...> to download
  // a page of type T, or MultiPageRepository to download multiple pages.
  // The fastest resolver wins. However, a page only needs to be
  // registered one SinglePageRepository to function.
  //
  // For example, two instances of HomePageRepository are registered to
  // download instances of HomePage.
  protected readonly registrations = [
    new SinglePageRepositoryRegistration(HomePage, JsonHomePageRepository),
    new SinglePageRepositoryRegistration(HomePage, XmlHomePageRepository),
    new SinglePageRepositoryRegistration(AboutPage, JsonAboutPageRepository),
    new SinglePageRepositoryRegistration(AboutPage, XmlAboutPageRepository),
    new SinglePageRepositoryRegistration(BlogPage, JsonBlogPageRepository),
    new SinglePageRepositoryRegistration(BlogPage, XmlBlogPageRepository),
    new MultiPageRepositoryRegistration(BlogPage, JsonBlogPageRepository),
    new MultiPageRepositoryRegistration(BlogPage, XmlBlogPageRepository),
  ];
}

////////////////////////////////////////
// Runtime Simulation
////////////////////////////////////////

async function main(): Promise<void> {
  const downloader = new SiteContentDownloader();
  const cms = new CMS();

  /////////////////////
  // Expected Output //
  // --------------- //
  // HOME -> ...     //
  // POSTS -> ...    //
  // POST 1 -> ...   //
  // ABOUT -> ...    //
  /////////////////////

  // run on home resolver
  downloader.downloadPage(HomePage, undefined);
  // run on about resolver
  downloader.downloadPage(AboutPage, undefined);
  // run on post resolver
  downloader.downloadPage(BlogPage, 1);
  // run on posts resolver
  downloader.downloadPages(BlogPage);

  // run on home page
  cms.page(HomePage).subscribe(
    page => console.log('HOME -> ', page),
  );
  // run on posts page
  cms.pages(BlogPage).subscribe(
    page => console.log('POSTS -> ', page),
  );
  // run on post 1 page
  cms.page(BlogPage, { key: 'id', value: 1 } as CmsPageFilter<BlogPage>).subscribe(
    page => console.log('POST 1 -> ', page),
  );
  // run on post 2 page (NOT LOADED BY DOWNLOADER)
  cms.page(BlogPage, { key: 'id', value: 2 }).subscribe(
    page => console.log('POST 2 -> ', page),
  );
  // run on about page - data loads before page renders
  setTimeout(
    () => {
      cms.page(AboutPage).subscribe(
        page => console.log('ABOUT -> ', page),
      );
    },
    1000,
  );

}

main();
```