import { log } from '../helpers';
import { TEMPLATES } from '../constants';

export class CompactRollTableDisplay extends RollTableConfig 
{
  cellId;

  constructor(object, options) 
{
    super(object, options);
    log(false, 'CompactRollTableDisplay constructor', {
      options,
    });
    this.cellId = options.cellId;
  }

  get isEditable() 
{
    return false;
  }

  static get defaultOptions() 
{
    return foundry.utils.mergeObject(super.defaultOptions, {
      template: TEMPLATES.compactRollTable,
      editable: false,
      popOut: false,
    });
  }

  _replaceHTML(element, html) 
{
    $(this.cellId).find('.gm-screen-grid-cell-title').text(this.title);

    const gridCellContent = $(this.cellId).find('.gm-screen-grid-cell-content');
    gridCellContent.html(html);
    this._element = html;
  }

  _injectHTML(html) 
{
    $(this.cellId).find('.gm-screen-grid-cell-title').text(this.title);

    const gridCellContent = $(this.cellId).find('.gm-screen-grid-cell-content');

    log(false, 'CompactJournalEntryDisplay _injectHTML', {
      cellId: this.cellId,
      html,
    });

    gridCellContent.append(html);
    this._element = html;
  }

  activateListeners(html) 
{
    $(html).on(
      'click',
      'a',
      (e) => 
{
        const action = e.currentTarget.dataset.action;

        log(false, 'CompactRollTableDisplay click registered', {
          table: this,
          action,
        });

        switch (action) 
{
          case 'rolltable-reset': {
            this.document.reset();
            break;
          }
          case 'rolltable': {
            this.document.draw();
            break;
          }
        }
      }
    );

    // we purposefully are not calling
    // super.activateListeners(html);
  }

  getData() 
{
    const sheetData = super.getData();

    // TODO: Rolltable.Result and Results wrong
    const enrichedResults = sheetData.results.map((result) => 
{
      let label;

      switch (result.type) 
{
        case CONST.TABLE_RESULT_TYPES.COMPENDIUM: {
          label = `@Compendium[${result.collection}.${result.resultId}]{${result.text}}`;
          break;
        }
        case CONST.TABLE_RESULT_TYPES.ENTITY: {
          label = `@${result.collection}[${result.resultId}]{${result.text}}`;
          break;
        }
        default:
          label = result.text;
      }

      return {
        ...result,
        label,
      };
    });

    return { ...sheetData, enrichedResults };
  }
}
