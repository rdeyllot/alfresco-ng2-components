/*!
 * @license
 * Copyright 2016 Alfresco Software, Ltd.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/*
import { it, describe, expect, inject, beforeEachProviders, beforeEach, afterEach } from '@angular/core/testing';
import { PLATFORM_PIPES } from '@angular/core';
import { TestComponentBuilder } from '@angular/compiler/testing';
import { AlfrescoSearchAutocompleteComponent } from './alfresco-search-autocomplete.component';
import { AlfrescoThumbnailService } from './../services/alfresco-thumbnail.service';
import { TranslationMock } from './../assets/translation.service.mock';
import { AlfrescoSearchService } from '../services/alfresco-search.service';
import {
    AlfrescoApiService,
    AlfrescoSettingsService,
    AlfrescoAuthenticationService,
    AlfrescoContentService,
    AlfrescoTranslationService,
    AlfrescoPipeTranslate
} from 'ng2-alfresco-core';

declare let jasmine: any;

describe('AlfrescoSearchAutocompleteComponent', () => {

    let alfrescoSearchComponentFixture, element, component;

    let result = {
        list: {
            entries: [
                {
                    entry: {
                        id: '123',
                        name: 'MyDoc',
                        isFile : true,
                        content: {
                            mimeType: 'text/plain'
                        },
                        createdByUser: {
                            displayName: 'John Doe'
                        },
                        modifiedByUser: {
                            displayName: 'John Doe'
                        }
                    }
                }
            ]
        }
    };

    let folderResult = {
        list: {
            entries: [
                {
                    entry: {
                        id: '123',
                        name: 'MyFolder',
                        isFile : false,
                        isFolder : true,
                        createdByUser: {
                            displayName: 'John Doe'
                        },
                        modifiedByUser: {
                            displayName: 'John Doe'
                        }
                    }
                }
            ]
        }
    };

    let noResult = {
        list: {
            entries: []
        }
    };

    let errorJson = {
        error: {
            errorKey: 'Search failed',
            statusCode: 400,
            briefSummary: '08220082 search failed',
            stackTrace: 'For security reasons the stack trace is no longer displayed, but the property is kept for previous versions.',
            descriptionURL: 'https://api-explorer.alfresco.com'
        }
    };

    beforeEachProviders(() => {
        return [
            { provide: PLATFORM_PIPES, useValue: AlfrescoPipeTranslate, multi: true },
            {provide: AlfrescoTranslationService, useClass: TranslationMock},
            AlfrescoThumbnailService,
            AlfrescoSettingsService,
            AlfrescoApiService,
            AlfrescoAuthenticationService,
            AlfrescoContentService,
            AlfrescoSearchService
        ];
    });

    beforeEach(inject([TestComponentBuilder], (tcb: TestComponentBuilder) => {
        return tcb
            .createAsync(AlfrescoSearchAutocompleteComponent)
            .then(fixture => {
                jasmine.Ajax.install();
                alfrescoSearchComponentFixture = fixture;
                element = alfrescoSearchComponentFixture.nativeElement;
                component = alfrescoSearchComponentFixture.componentInstance;
            });
    }));

    afterEach(() => {
        jasmine.Ajax.uninstall();
    });

    it('should setup i18n folder', () => {
        let translation = jasmine.createSpyObj('AlfrescoTranslationService', [
            'addTranslationFolder'
        ]);
        let search = new AlfrescoSearchAutocompleteComponent(null, translation, null);
        expect(search).toBeDefined();

    });

    it('should display search results when a search term is provided', () => {
        let searchTerm = { currentValue: 'customSearchTerm', previousValue: ''};
        spyOn(component, 'displaySearchResults').and.stub();
        component.searchTerm = searchTerm;
        component.ngOnChanges({
            searchTerm: searchTerm
        });
        alfrescoSearchComponentFixture.detectChanges();
        expect(component.displaySearchResults).toHaveBeenCalledWith(searchTerm.currentValue);
    });

    it('should display the returned search results', (done) => {
        component.resultsEmitter.subscribe(x => {
            alfrescoSearchComponentFixture.detectChanges();
            expect( element.querySelector('#result_user_0').innerHTML).toBe('John Doe');
            expect( element.querySelector('#result_name_0').innerHTML).toBe('<b _ngcontent-a-1="">MyDoc</b>');
            done();
        });

        component.searchTerm = { currentValue: 'searchTerm', previousValue: ''};
        component.ngOnChanges({searchTerm: component.searchTerm });

        jasmine.Ajax.requests.mostRecent().respondWith({
            status: 200,
            contentType: 'json',
            responseText: result
        });
    });

    it('should display the correct thumbnail for result items', (done) => {

        component.baseComponentPath = 'http://localhost';
        spyOn(component.alfrescoThumbnailService, 'getMimeTypeIcon').and.returnValue('fake-type-icon.svg');
        spyOn(component.alfrescoThumbnailService, 'getMimeTypeKey').and.returnValue('FAKE_TYPE');

        component.resultsEmitter.subscribe(() => {
            alfrescoSearchComponentFixture.detectChanges();
            let imgEl = element.querySelector('#result_row_0 img');
            expect(imgEl).not.toBeNull();
            expect(imgEl.src).toBe('http://localhost/img/fake-type-icon.svg');
            expect(imgEl.alt).toBe('SEARCH.ICONS.FAKE_TYPE');
            done();
        });

        component.searchTerm = { currentValue: 'searchTerm', previousValue: ''};
        component.ngOnChanges({searchTerm: component.searchTerm });

        jasmine.Ajax.requests.mostRecent().respondWith({
            status: 200,
            contentType: 'json',
            responseText: result
        });
    });

    it('should display no result if no result are returned', (done) => {
        component.resultsEmitter.subscribe(x => {
            alfrescoSearchComponentFixture.detectChanges();
            expect(element.querySelector('#search_no_result')).not.toBeNull();
            done();
        });

        component.searchTerm =  { currentValue: 'searchTerm', previousValue: ''};
        component.ngOnChanges({searchTerm: component.searchTerm});

        jasmine.Ajax.requests.mostRecent().respondWith({
            status: 200,
            contentType: 'json',
            responseText: noResult
        });
    });

    it('should display an error if an error is encountered running the search', (done) => {
        component.errorEmitter.subscribe(() => {
            alfrescoSearchComponentFixture.detectChanges();
            let resultsEl = element.querySelector('[data-automation-id="autocomplete_results"]');
            let errorEl = element.querySelector('[data-automation-id="autocomplete_error_message"]');
            expect(resultsEl).toBeNull();
            expect(errorEl).not.toBeNull();
            expect(errorEl.innerText).toBe('SEARCH.RESULTS.ERROR');
            done();
        });

        component.searchTerm =  { currentValue: 'searchTerm', previousValue: ''};
        component.ngOnChanges({searchTerm: component.searchTerm});

        jasmine.Ajax.requests.mostRecent().respondWith({
            status: 500,
            contentType: 'json',
            responseText: errorJson
        });
    });

    it('should emit preview when file item clicked', (done) => {
        component.resultsEmitter.subscribe(x => {
            alfrescoSearchComponentFixture.detectChanges();
            element.querySelector('#result_row_0').click();
        });

        component.searchTerm =  { currentValue: 'searchTerm', previousValue: ''};
        component.ngOnChanges({searchTerm: component.searchTerm});

        jasmine.Ajax.requests.mostRecent().respondWith({
            status: 200,
            contentType: 'json',
            responseText: result
        });

        component.preview.subscribe(e => {
           done();
        });
    });

    it('should not emit preview if a non-file item is clicked', (done) => {
        spyOn(component.preview, 'emit');
        component.resultsEmitter.subscribe(x => {
            alfrescoSearchComponentFixture.detectChanges();
            element.querySelector('#result_row_0').click();
            expect(component.preview.emit).not.toHaveBeenCalled();
            done();
        });

        component.searchTerm =  { currentValue: 'searchTerm', previousValue: ''};
        component.ngOnChanges({searchTerm: component.searchTerm});

        jasmine.Ajax.requests.mostRecent().respondWith({
            status: 200,
            contentType: 'json',
            responseText: folderResult
        });
    });

});
*/
