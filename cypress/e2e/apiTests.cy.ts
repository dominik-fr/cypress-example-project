import * as articleTags from "../fixtures/tags.json"
import * as articles from "../fixtures/articles.json"

describe("Test suite with API handling", () => {

    beforeEach('Login to app', () => {
        //this method is in custom commands
        cy.loginToApplication()
    })

    it('Login by api call test', () => {
        cy.log("login success!")
    })

    it('Add article by UI and verify API response', () => {
        let articleTitle = "New test title "
        let articleDescription = "New description of test title"
        let articleBody = "New body of test title"

        cy.intercept("POST", "**/" + Cypress.env('apiUrl') + "api/articles").as("postArticle")

        cy.contains("New Article").click()
        //randomize article name to avoid duplicated post error; could also be done with additional libraries eg. faker
        cy.get('[formcontrolname="title"]').type(articleTitle + Cypress._.random(0, 1e6))
        cy.get('[formcontrolname="description"]').type(articleDescription)
        cy.get('[formcontrolname="body"]').type(articleBody)
        cy.contains('Publish Article').click()

        cy.wait('@postArticle').then(xhr => {
            console.log(xhr)
            //post action should be successfull (code 200) and should contain provided data
            expect(xhr.response.statusCode).to.equal(200)
            expect(xhr.request.body.article.body).to.equal(articleBody)
            expect(xhr.response.body.article.description).to.equal(articleDescription)
        })
    })

    it('Mock and verify tag list', () => {
        //in some cases it's easier to simply import json instead of uning cypress fixture
        let tagsArray = articleTags.tags

        //intercept with routeMatcher and routeHandler
        cy.intercept({ method: 'GET', path: 'tags' }, { fixture: 'tags.json' }).as("tagsSwap")
        cy.wait("@tagsSwap")
        cy.get('.tag-list').then(tagList => {
            tagsArray.forEach(tag => {
                cy.wrap(tagList).should('contain', tag)
            });
        })
    })

    it('Intercepting and modifying API requests/responses for posting new article', () => {
        let articleTitle = "New test title "
        let articleDescription = "New description of test title"
        let interceptedDescription = "Intercepted and swapped description"
        let articleBody = "Lorem ipsum"

        //after interception of POST API call verify original description and swap with new one  
        cy.intercept("POST", "**/" + Cypress.env('apiUrl') + "api/articles", (req) => {
            req.reply(res => {
                expect(res.body.article.description).to.equal(articleDescription)
                //replacing intercepted post description with new one               
                res.body.article.description = interceptedDescription
            })
        }).as("postArticles")

        cy.contains("New Article").click()
        //randomize title name; could also be done with additional libraries eg. faker
        cy.get('[formcontrolname="title"]').type(articleTitle + Cypress._.random(0, 1e6).toString())

        //UI based article creation
        cy.get('[formcontrolname="description"]').type(articleDescription)
        cy.get('[formcontrolname="body"]').type(articleBody)
        cy.contains('Publish Article').click()

        //newly created article shall be intercepted and modified
        cy.wait('@postArticles').then(xhr => {
            expect(xhr.response.statusCode).to.equal(200)
            expect(xhr.request.body.article.body).to.equal(articleBody)
            expect(xhr.response.body.article.description).to.equal(interceptedDescription)
        })
    })

    it('Mock article list and verify like button behaviour', () => {
        //handling fixture via json import
        let firstArticleLikeCount = articles.articles[0].favoritesCount
        let secondArticleLikeCount = articles.articles[1].favoritesCount

        //empty list first
        cy.intercept('GET', '**/articles/feed*', { "articles": [], "articlesCount": 0 })
        //then populate article list with prepared mock fixture
        cy.intercept('GET', '**/articles*', { fixture: 'articles.json' })

        cy.contains('Global Feed').click()
        cy.get('app-article-list button').then(listOfButtons => {
            expect(listOfButtons[0]).to.contain(firstArticleLikeCount)
            expect(listOfButtons[1]).to.contain(secondArticleLikeCount)
        })

        //handling fixture via cy.fixture
        cy.fixture('articles').then(file => {
            const articleLink = file.articles[1].slug
            file.articles[1].favoritesCount += 1
            //mocking fav button action API
            cy.intercept('POST', '**/articles/' + articleLink + '/favorite', file)
        })

        cy.get('app-article-list button')
            .eq(1)
            .click()
            .should('contain', secondArticleLikeCount + 1)
    })

    it('Add article via API and verify delete button', () => {

        cy.intercept("DELETE", "**/" + Cypress.env('apiUrl') + "api/articles/*", () => { })
            .as("deleteArticle");

        //body of request for newly created article
        const bodyRequest = {
            "article": {
                "tagList": [],
                "title": "Title done by API req no " + Cypress._.random(0, 1e6),
                "description": "This is API created desc",
                "body": "And this is API created body"
            }
        }

        //token received during login will be required to add new article
        cy.get('@loginToken').then(token => {
            //add new article via API
            cy.request({
                method: 'POST',
                url: "https://" + Cypress.env('apiUrl') + "api/articles",
                headers: { 'Authorization': 'Token ' + token },
                body: bodyRequest
            }).then(response => {
                //post should be created (code 200)
                expect(response.status).to.equal(200)
                cy.log("New article created", bodyRequest)
            })

            //using UI get to first article (newly added one) and delete it
            cy.contains('Global Feed').click()
            cy.get('.article-preview').first().click()
            cy.get('.article-actions').contains('Delete Article').click()
            cy.contains('Global Feed').click()

            //wait till deletion takes place
            cy.wait("@deleteArticle");
            //request fresh version of article list
            cy.request({
                method: 'GET',
                url: "https://" + Cypress.env('apiUrl') + "api/articles?limit=10&offset=0",
                headers: { 'Authorization': 'Token ' + token },
            }).then(response => {
                expect(response.status).to.equal(200)
                expect(response.body.articles[0].title).not.to.equal(bodyRequest.article.title)
            })
        })
    })
})